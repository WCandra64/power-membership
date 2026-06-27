export async function uploadImage(name: string, file: File | null) {
  const publicId = `${name.toLowerCase().replace(/\s+/g, "")}-${Date.now()}`;

  const formData = new FormData();
  formData.append("file", file!);
  formData.append("publicId", publicId);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  return await res.json();
}

export async function destroyImage(publicId: string) {
  const res = await fetch("/api/upload", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicId,
    }),
  });

  if (!res.ok) {
    throw new Error(JSON.stringify(res.json));
  }
}