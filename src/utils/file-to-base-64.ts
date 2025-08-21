export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("File could not be converted to base64"));
      }
    });

    reader.addEventListener("error", () => {
      reject(new Error("Failed to read file"));
    });

    reader.readAsDataURL(file);
  });
};
