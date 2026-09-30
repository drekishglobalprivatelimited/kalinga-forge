export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Poka Print Studio",
    description:
      "India's premium 3D printing service. Custom prototypes, engineering parts, gifts, and more. Fast turnaround, competitive pricing.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://pokaprintstudio.in",
    telephone: process.env.NEXT_PUBLIC_BUSINESS_PHONE,
    priceRange: "₹₹",
    image: `${process.env.NEXT_PUBLIC_APP_URL}/og-default.jpg`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "Karnataka",
      addressLocality: "Bangalore",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.9716,
      longitude: 77.5946,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
    sameAs: [],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "3D Printing Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "STL 3D Printing" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Engineering Prototypes" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Product Design" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Small Batch Manufacturing" } },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema({
  product,
}: {
  product: {
    name: string;
    description: string;
    image: string;
    price: number;
    slug: string;
    reviews?: Array<{ rating: number; body?: string; title?: string }>;
  };
}) {
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 5;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/${product.slug}`,
    brand: { "@type": "Brand", name: "Poka Print Studio" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Poka Print Studio" },
    },
    ...(product.reviews && product.reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: product.reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
