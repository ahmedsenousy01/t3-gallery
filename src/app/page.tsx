import Image from "next/image";
import Link from "next/link";

const mockImageUrls = [
  "https://utfs.io/f/6f9bd984-a35a-45a7-9c3f-f0484a16a13b-mgobc5.png",
  "https://utfs.io/f/1a4904d7-bd90-4e46-9a7d-af16c3c6133e-s39ju4.jpg",
  "https://utfs.io/f/a0b8fc48-1626-4e68-bb0a-210ca029a804-9gpu2.png",
  "https://utfs.io/f/b1262acb-e2f3-4a99-981a-28feb5ad2072-u67de7.png",
];

const mockImages = mockImageUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

export default function HomePage() {
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {[...mockImages, ...mockImages, ...mockImages].map((img) => (
          <div key={img.id} className="w-48">
            <Link href={`/post/${img.id}`}>
              <Image
                width={300}
                height={300}
                src={img.url}
                alt={img.id.toString()}
                className="h-auto w-full"
              />
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
