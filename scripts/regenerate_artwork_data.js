#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, "..");
const artworkRoot = path.join(baseDir, "img", "artwork");
const outputPath = path.join(baseDir, "_data", "artwork.json");

const sections = [
  {
    slug: "watercolours",
    number: "01",
    title: "Watercolours",
    description:
      "I started learning watercolour painting in 2026. Most paintings created during classes or at my home in Regina but I've been trying to use more watercolours while travelling too.",
  },
  {
    slug: "pens-markers",
    number: "02",
    title: "Pens and Markers",
    description:
      "Sketches created with Stabilo pens, Pigma microns, and Tombow water-based and alcohol-based markers. Some of the sketches here are on-location urban sketches.",
  },
  {
    slug: "life-drawing",
    number: "03",
    title: "Life Drawing",
    description: "Drawn from life using chalk pastels on newsprint or ProCreate on iPad.",
  },
  {
    slug: "digital",
    number: "04",
    title: "Digital",
    description:
      "Digital paintings, sketches, pixel art, and animations created using Procreate, Fresco, Sketchbook, Pixel Studio, Rough Animator, Tilt Brush, and maybe more that I can't recall right now.",
  },
  {
    slug: "pencil-charcoal",
    number: "05",
    title: "Pencil and Charcoal",
    description: "At rare occasions, I sketch with graphite or charcoal.",
  },
  {
    slug: "miscellaneous",
    number: "06",
    title: "Miscellaneous",
    description:
      "Miscellaneous materials, most commonly acrylic on canvas. Some of the acrylic paintings were created together with my wife.",
  },
];

const mediaExtensions = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".mov", ".mp4"]);

function isVideo(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ext === ".mov" || ext === ".mp4";
}

function listSectionItems(section) {
  const sectionDir = path.join(artworkRoot, section.slug);

  if (!fs.existsSync(sectionDir)) {
    throw new Error(`Missing artwork directory: ${path.relative(baseDir, sectionDir)}`);
  }

  const items = fs
    .readdirSync(sectionDir)
    .filter((name) => mediaExtensions.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
    .map((name, index) => ({
      src: `/img/artwork/${section.slug}/${name}`,
      alt: `${section.title} ${index + 1}`,
      type: isVideo(name) ? "video" : "image",
    }));

  return items;
}

function main() {
  const generatedSections = sections.map((section) => ({
    slug: section.slug,
    number: section.number,
    title: { en: section.title },
    description: { en: section.description },
    items: listSectionItems(section),
  }));

  const featuredItems = generatedSections.flatMap((section) => section.items.slice(0, 2));

  const data = {
    heading: { en: "Artwork" },
    intro: { en: "Six sections of personal artwork." },
    featured: {
      slug: "featured",
      number: "00",
      title: { en: "Featured Artwork" },
      description: {
        en: "A selection across watercolours, pens and markers, life drawing, digital work, pencil and charcoal, and miscellaneous pieces.",
      },
      items: featuredItems,
    },
    sections: generatedSections,
  };

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2) + "\n");

  console.log(`Regenerated ${path.relative(baseDir, outputPath)}`);
  for (const section of data.sections) {
    console.log(`${section.number} ${section.title.en}: ${section.items.length}`);
  }
}

main();
