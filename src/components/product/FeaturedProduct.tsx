import { Link } from 'react-router';
import type { Product } from '../../types/product';
import PriceTag from './PriceTag';

interface FeaturedProductProps {
  product: Product;
}

/** Catalog banner: today's biggest discount, shown large on a powder "compact". */
export default function FeaturedProduct({ product }: FeaturedProductProps) {
  const productPath = `/products/${product.id}`;

  return (
    <section
      aria-labelledby="featured-title"
      className="mb-10 grid items-center gap-8 overflow-hidden rounded-3xl border border-line bg-blush p-6 sm:p-10 md:grid-cols-[1fr_auto]"
    >
      <div className="flex flex-col items-start gap-4">
        <p className="text-sm font-semibold text-berry-dark">
          Today’s best deal, {Math.round(product.discountPercentage)}% off
        </p>
        <h2 id="featured-title" className="max-w-md text-4xl leading-tight font-bold text-ink sm:text-5xl">
          {product.title}
        </h2>
        <p className="line-clamp-3 max-w-md leading-relaxed text-ink-soft">{product.description}</p>
        <PriceTag price={product.price} discountPercentage={product.discountPercentage} size="lg" />
        <Link
          to={productPath}
          className="inline-flex min-h-11 items-center rounded-full bg-berry px-6 font-semibold text-white transition-colors hover:bg-berry-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-berry"
        >
          View product
        </Link>
      </div>

      <div className="relative order-first mx-auto aspect-square w-44 sm:w-72 md:order-none">
        <div aria-hidden="true" className="absolute inset-0 rounded-full bg-powder ring-1 ring-line" />
        <img
          src={product.thumbnail}
          alt={product.title}
          width={288}
          height={288}
          className="relative h-full w-full object-contain p-8"
        />
      </div>
    </section>
  );
}
