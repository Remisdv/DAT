import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";

export default async function UploadsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§5.7 · Upload de fichiers"
                title="Multer, validation MIME & quota"
                description="Images produits et fichiers de catégorie, stockés sur le système de fichiers du conteneur BO, servis via Nginx avec cache."
            />

            <h2 id="valeur">Valeur métier</h2>
            <p>
                Les administrateurs doivent pouvoir uploader des images de produits, de catégories et d'items de carrousel. La
                validation doit prévenir les uploads de fichiers malveillants (exécutables, scripts) et limiter l'espace disque.
            </p>

            <h2 id="conception">Conception</h2>
            <ul>
                <li><strong>Multer</strong> — middleware d'upload multipart, intégré via <code>@nestjs/platform-express</code></li>
                <li><strong>Validation MIME</strong> — liste blanche : <code>image/jpeg</code>, <code>image/png</code>, <code>image/webp</code></li>
                <li><strong>Limite de taille</strong> — 5 Mo par fichier, configuré <code>client_max_body_size 10M</code> côté Nginx</li>
                <li><strong>Nom de fichier</strong> — UUID v4 + extension d'origine, pour éviter les collisions et les path traversal</li>
                <li><strong>Stockage</strong> — volume Docker <code>uploads:/app/uploads</code> sur le conteneur BO</li>
            </ul>

            <pre><code className="language-typescript">{`@Post('upload')
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, \`\${randomUUID()}\${extname(file.originalname)}\`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
}))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { path: \`/uploads/\${file.filename}\` };
}`}</code></pre>

            <h2 id="servir">Servir les fichiers</h2>
            <p>
                Les fichiers uploadés sont accessibles via <code>bo.localhost/uploads/*</code>. Nginx proxy-pass vers la
                Gateway qui sert le répertoire statique. Un header <code>Cache-Control: public, max-age=31536000</code> est
                ajouté pour optimiser les performances client.
            </p>

            <Callout kind="warning" title="Limites du stockage local">
                Le stockage sur système de fichiers n'est pas adapté au multi-instance : un fichier uploadé sur l'instance A
                n'est pas visible par l'instance B. <strong>Migration S3 / MinIO</strong> prévue pour le passage en prod
                scalée.
            </Callout>
        </>
    );
}
