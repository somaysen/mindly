"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSync } from "@tldraw/sync";
import { Loader2, RotateCw, UserRound, UserRoundCheck } from "lucide-react";
import {
  atom,
  Tldraw,
  UserRecordType,
  createCachedUserResolve,
  createUserId,
  useEditor,
  usePresence,
} from "tldraw";
import { track } from "@tldraw/state-react";
import type {
  Editor,
  TLAssetStore,
  TLUser,
  TLUserStore,
  TLUiPeopleMenuAvatarProps,
  TLUiPeopleMenuItemProps,
} from "tldraw";
import "tldraw/tldraw.css";
import { createCanvasSyncTicket } from "@/api/canvas/createCanvasSyncTicket";
import type { CanvasRole } from "@/types/canvas";
import { getApiErrorMessage } from "@/lib/apiError";
import { getCanvasSyncUrl } from "@/features/canvas/utils/canvasSyncUrl";
import { fileToBase64DataUri } from "@/lib/fileToBase64DataUri";
import { useProfileInfo } from "@/features/profile/hooks/useProfile";
import { useGetCanvasMembers } from "@/features/canvas/hooks/useCanvas";
import type { CanvasMember } from "@/types/canvas";

const canvasAssetStore: TLAssetStore = {
  upload: async (_asset, file) => ({
    src: await fileToBase64DataUri(file),
  }),
  resolve: (asset) => asset.props.src ?? null,
};

const CanvasPeopleMenuAvatar = track(function CanvasPeopleMenuAvatar({
  userId,
}: TLUiPeopleMenuAvatarProps) {
  const editor = useEditor();
  const presence = usePresence(userId);
  if (!presence) return null;

  const user = editor.getAttributionUser(UserRecordType.parseId(userId));
  return (
    <div
      className="tlui-people-menu__avatar overflow-hidden"
      style={{ backgroundColor: presence.color }}
    >
      {user?.imageUrl ? (
        <img
          src={user.imageUrl}
          alt={`${presence.userName || "Collaborator"} avatar`}
          className="h-full w-full object-cover"
        />
      ) : (
        presence.userName?.trim()?.charAt(0)?.toUpperCase() || "?"
      )}
    </div>
  );
});

const CanvasPeopleMenuItem = track(function CanvasPeopleMenuItem({
  userId,
}: TLUiPeopleMenuItemProps) {
  const editor = useEditor();
  const presence = usePresence(userId);
  if (!presence) return null;

  const user = editor.getAttributionUser(UserRecordType.parseId(userId));
  const isCurrentUser = presence.userId === editor.user.getRecordId();
  const theyAreFollowingYou =
    presence.followingUserId === editor.user.getRecordId();
  const youAreFollowingThem =
    editor.getInstanceState().followingUserId === userId;
  const handleFollowClick = () => {
    if (youAreFollowingThem) {
      editor.stopFollowingUser();
    } else {
      editor.startFollowingUser(userId);
    }
  };

  return (
    <div className="tlui-people-menu__item">
      <button
        type="button"
        className="tlui-button tlui-button__menu tlui-people-menu__item__button flex min-w-0 flex-1 items-center gap-3"
        onClick={() => editor.zoomToUser(userId)}
        title={presence.userName || "Collaborator"}
      >
        <span
          className="tlui-people-menu__avatar shrink-0 overflow-hidden"
          style={{ backgroundColor: presence.color }}
        >
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            presence.userName?.trim()?.charAt(0)?.toUpperCase() || "?"
          )}
        </span>
        <span className="tlui-people-menu__name">
          {presence.userName?.trim() || "User"}
          {isCurrentUser ? " (You)" : ""}
        </span>
      </button>
      {!isCurrentUser && (
        <button
          type="button"
          className="tlui-button tlui-button__icon tlui-people-menu__item__follow"
          title={
            theyAreFollowingYou
              ? "Following you"
              : youAreFollowingThem
                ? "Stop following"
                : "Follow"
          }
          aria-label={
            youAreFollowingThem ? "Stop following collaborator" : "Follow collaborator"
          }
          onClick={handleFollowClick}
          disabled={theyAreFollowingYou}
        >
          {youAreFollowingThem || theyAreFollowingYou ? (
            <UserRoundCheck size={16} />
          ) : (
            <UserRound size={16} />
          )}
        </button>
      )}
    </div>
  );
});

const canvasTldrawComponents = {
  PeopleMenuAvatar: CanvasPeopleMenuAvatar,
  PeopleMenuItem: CanvasPeopleMenuItem,
};

export default function MindlyCanvasEditor({
  canvasId,
  role,
}: {
  canvasId: string;
  role: CanvasRole | null;
}) {
  const [connectionAttempt, setConnectionAttempt] = useState(0);
  const profileQuery = useProfileInfo();
  const membersQuery = useGetCanvasMembers(canvasId, role === "owner");

  const profile = profileQuery.data?.data?.user ?? profileQuery.data?.data ?? profileQuery.data?.user;
  const profileId = String(
    profile?._id ?? profile?.id ?? profile?.userId ?? profile?.authID ?? profile?.auth?.id ?? "",
  );
  const profileEmail = profile?.email ?? profile?.auth?.email ?? "";
  const currentName =
    profile?.name?.trim() || profileEmail.split("@")[0]?.replace(/[._-]+/g, " ") || "User";
  const currentAvatar =
    profile?.avatar ?? profile?.avatarUrl ?? profile?.imageUrl ?? "";

  const currentUserSignal = useMemo(
    () => atom<TLUser | null>("mindly-canvas-current-user", null),
    [],
  );
  const membersSignal = useMemo(
    () => atom<CanvasMember[]>("mindly-canvas-members", []),
    [],
  );

  useEffect(() => {
    if (!profileId) return;
    currentUserSignal.set(
      UserRecordType.create({
        id: createUserId(profileId),
        name: currentName,
        color: "#ec4899",
        imageUrl: currentAvatar,
      }),
    );
  }, [currentAvatar, currentName, currentUserSignal, profileId]);

  useEffect(() => {
    membersSignal.set(membersQuery.data ?? []);
  }, [membersQuery.data, membersSignal]);

  const users = useMemo(() => {
    const resolve = createCachedUserResolve((userId) => {
      const currentUser = currentUserSignal.get();
      if (currentUser?.id === createUserId(userId)) return currentUser;

      const member = membersSignal
        .get()
        .find(
          (candidate) =>
            candidate.userId === userId ||
            createUserId(candidate.userId) === userId,
        );
      if (!member) return null;

      const name =
        member.name ||
        member.user?.name ||
        member.email?.split("@")[0]?.replace(/[._-]+/g, " ") ||
        "User";
      const imageUrl =
        member.avatar ||
        member.avatarUrl ||
        member.imageUrl ||
        member.user?.avatar ||
        member.user?.avatarUrl ||
        member.user?.imageUrl ||
        "";

      return UserRecordType.create({
        id: createUserId(userId),
        name,
        color: "#ec4899",
        imageUrl,
      });
    });

    return { currentUser: currentUserSignal, resolve };
  }, [currentUserSignal, membersSignal]);

  return (
    <CanvasSyncSession
      key={`${canvasId}:${connectionAttempt}`}
      canvasId={canvasId}
      role={role}
      users={users}
      onRetry={() => setConnectionAttempt((attempt) => attempt + 1)}
    />
  );
}

function CanvasSyncSession({
  canvasId,
  role,
  users,
  onRetry,
}: {
  canvasId: string;
  role: CanvasRole | null;
  users: TLUserStore;
  onRetry: () => void;
}) {
  const remoteStore = useSync({
    assets: canvasAssetStore,
    uri: async () => {
      const { ticket } = await createCanvasSyncTicket(canvasId);
      if (typeof ticket !== "string" || !ticket) {
        throw new Error("The server did not return a canvas sync ticket.");
      }
      return getCanvasSyncUrl(canvasId, ticket);
    },
    users,
  });

  const handleMount = useCallback(
    (editor: Editor) => {
      if (role === "viewer") {
        editor.updateInstanceState({ isReadonly: true });
      }
    },
    [role],
  );

  if (remoteStore.status === "loading") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-white/65">
        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
        Connecting to the shared canvas...
      </div>
    );
  }

  if (remoteStore.status === "error") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center">
        <p role="alert" className="max-w-lg text-sm text-red-200">
          Could not connect to this canvas.{" "}
          {getApiErrorMessage(remoteStore.error, "Check your connection and try again.")}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
        >
          <RotateCw size={15} />
          Reconnect
        </button>
      </div>
    );
  }

  return (
    <div className="mindly-tldraw relative h-full w-full">
      <Tldraw
        store={remoteStore.store}
        components={canvasTldrawComponents}
        colorScheme="dark"
        autoFocus
        onMount={handleMount}
      />
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-lg border border-white/10 bg-black/75 px-3 py-1.5 text-xs text-white/75"
      >
        Live collaboration · Changes auto-saved
        {role === "viewer" ? " · View only" : ""}
      </div>
    </div>
  );
}
