import { prisma } from "@/app/lib/prisma";
import UploadPhotoForm from "./UploadPhotoForm";
import CreateCategoryForm from "./CreateCategoryForm";
import PhotoCard from "./PhotoCard";
import DeleteCategoryButton from "./DeleteCategoryButton";

export default async function AdminPhotosPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { photos: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl italic">Photos & Catégories</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Ajoutez de nouvelles photos, organisez-les par catégorie et choisissez
        celles à mettre en avant sur la page d&apos;accueil.
      </p>

      <div className="mt-8">
        <UploadPhotoForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-8">
        <CreateCategoryForm />
      </div>

      <div className="mt-10 space-y-12">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-display text-xl italic">
                {category.name}{" "}
                <span className="text-sm text-muted">({category.photos.length})</span>
              </h2>
              <DeleteCategoryButton id={category.id} name={category.name} />
            </div>

            {category.photos.length === 0 ? (
              <p className="mt-4 text-sm text-foreground/50">Aucune photo dans cette catégorie.</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {category.photos.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
