import { fileToBase64 } from "@/utils/file-to-base-64";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("fileToBase64", () => {
  let mockReader: {
    result: string | null;
    listeners: {
      load?: () => void;
      error?: () => void;
    };
    addEventListener: (event: "load" | "error", cb: () => void) => void;
    readAsDataURL: (file: File) => void;
  };

  beforeEach(() => {
    mockReader = {
      result: null,
      listeners: {},
      addEventListener: vi.fn((event: "load" | "error", cb: () => void) => {
        mockReader.listeners[event] = cb;
      }),
      readAsDataURL: vi.fn(),
    };

    vi.spyOn(window, "FileReader").mockImplementation(
      () => mockReader as unknown as FileReader,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should resolve with a base64 string on successful file read", async () => {
    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });
    const expectedBase64 = "data:text/plain;base64,dGVzdCBjb250ZW50";
    const promise = fileToBase64(mockFile);

    mockReader.result = expectedBase64;
    mockReader.listeners.load?.();

    await expect(promise).resolves.toBe(expectedBase64);
    expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
  });

  it("should reject with an error if the file read fails", async () => {
    const mockFile = new File(["test content"], "test.txt");
    const promise = fileToBase64(mockFile);

    mockReader.listeners.error?.();

    await expect(promise).rejects.toThrow("Failed to read file");
    expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
  });

  it("should reject if the reader result is not a string", async () => {
    const mockFile = new File(["test content"], "test.txt");
    const promise = fileToBase64(mockFile);

    mockReader.result = null;
    mockReader.listeners.load?.();

    await expect(promise).rejects.toThrow(
      "File could not be converted to base64",
    );
  });
});
