// src/services/imageUpload.ts
export type CloudinaryConfig = {
  cloudName: string;
  uploadPreset: string;
  folder?: string;
};

export const CLOUDINARY: CloudinaryConfig = {
  cloudName: "dvej3xdxr",
  uploadPreset: "petapp_unsigned",
  folder: "products",
};

export async function uploadToCloudinary(
  uri: string,
  cfg: CloudinaryConfig
): Promise<string> {
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

  const form = new FormData();
  form.append("file", {
    // @ts-ignore: tipo especial de RN { uri, name, type }
    uri,
    name: fileName,
    type: "image/jpeg",
  } as any);
  form.append("upload_preset", cfg.uploadPreset);
  if (cfg.folder) form.append("folder", cfg.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });

  const json = await res.json();
  if (!res.ok) {
    console.log("Cloudinary error:", json);
    throw new Error(json.error?.message || "Error subiendo a Cloudinary");
  }
  // URL https servida por CDN
  return json.secure_url as string;
}




// Note: este apartado es para la foto de perfil de usuario
// === NUEVO: config para fotos de perfil ===
export const CLOUDINARY_PROFILE: CloudinaryConfig = {
  cloudName: "dvej3xdxr",
  uploadPreset: "petapp_unsigned", // el mismo preset si permite unsigned
  folder: "users",                  // carpeta separada de 'products'
};

// (opcional) helper específico para perfiles
export async function uploadProfilePhoto(uri: string, uid: string) {
  // sube a subcarpeta por usuario: users/<uid>
  return uploadToCloudinary(uri, {
    cloudName: CLOUDINARY_PROFILE.cloudName,
    uploadPreset: CLOUDINARY_PROFILE.uploadPreset,
    folder: `${CLOUDINARY_PROFILE.folder}/${uid}`,
  });
}
