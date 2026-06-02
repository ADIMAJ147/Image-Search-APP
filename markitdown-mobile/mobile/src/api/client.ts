const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function convertToMarkdown(
  uri: string,
  name: string,
  mimeType: string,
): Promise<string> {
  const formData = new FormData();
  formData.append('file', { uri, name, type: mimeType } as unknown as Blob);

  const response = await fetch(`${API_URL}/convert`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `Server error ${response.status}`);
  }

  const data = (await response.json()) as { markdown: string };
  return data.markdown;
}
