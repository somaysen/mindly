export function fileToBase64DataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        const separator = reader.result.indexOf(",");
        if (separator === -1) {
          reject(new Error("Could not encode the selected file."));
          return;
        }

        const encodedContent = reader.result.slice(separator + 1);
        const mimeType =
          file.type.split(";")[0] || "application/octet-stream";
        resolve(`data:${mimeType};base64,${encodedContent}`);
      } else {
        reject(new Error("Could not encode the selected file."));
      }
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Could not read the selected file."));
    };

    reader.readAsDataURL(file);
  });
}
