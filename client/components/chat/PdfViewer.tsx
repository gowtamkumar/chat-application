export default function PdfViewer({
  file,
  pdf,
}: {
  file: string;
  pdf: { width: string; height: string };
}) {
  const { width, height } = pdf;
  return (
    <div>
      <embed
        style={{
          width,
          height,
        }}
        type="application/pdf"
        src={file}
      />
    </div>
  );
}
