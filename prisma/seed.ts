import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Clear existing data ---
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.author.deleteMany();

  // --- Create admin author ---
  const hashedPassword = await bcrypt.hash("admin1234", 12);
  const author = await prisma.author.create({
    data: {
      name: "Alex Rivera",
      email: "admin@chronicle.com",
      password: hashedPassword,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Lead Software Architect and founder of Chronicle. Passionate about AI, design systems, and mindful productivity.",
    },
  });

  const designAuthor = await prisma.author.create({
    data: {
      name: "Sophia Chen",
      email: "sophia@chronicle.com",
      password: await bcrypt.hash("design1234", 12),
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Senior UI/UX Designer with a passion for color psychology and premium interface experiences.",
    },
  });

  const lifestyleAuthor = await prisma.author.create({
    data: {
      name: "Emma Watson",
      email: "emma@chronicle.com",
      password: await bcrypt.hash("lifestyle1234", 12),
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Wellness coach and writer exploring the intersection of productivity, minimalism, and sustainable living.",
    },
  });

  console.log("✅ Authors created");

  // --- Create categories ---
  const techCategory = await prisma.category.create({
    data: { name: "Technology", slug: "technology" },
  });
  const designCategory = await prisma.category.create({
    data: { name: "Design", slug: "design" },
  });
  const lifestyleCategory = await prisma.category.create({
    data: { name: "Lifestyle", slug: "lifestyle" },
  });

  console.log("✅ Categories created");

  // --- Create posts ---
  const posts = [
    {
      title: "Navigating the Future of AI Development",
      slug: "navigating-the-future-of-ai-development",
      excerpt:
        "Explore the shifting landscape of software engineering in the age of generative AI, and learn how to adapt and thrive as a modern developer.",
      content: `# Navigating the Future of AI Development

The intersection of software engineering and artificial intelligence is shifting faster than ever before. As generative AI models become integrated into our IDEs, documentation, and deployment workflows, the role of the modern developer is fundamentally changing.

## The Paradigm Shift in Engineering

For decades, coding was about syntax, compilers, and debugging loops. AI assistants can now generate code blocks in seconds, shifting the bottleneck from *writing* code to *verifying and designing* code.

### Key Skills for the AI Era:

1. **Prompt Engineering & Context Design**: Providing the right instructions and codebase context to AI models.
2. **Architectural Thinking**: Designing modular, testable, and decoupled codebases.
3. **Rigorous Code Review**: Reading AI-generated code with a critical eye.

## Pair Programming with AI: Best Practices

- **Plan Before You Prompt**: Spend time designing before generating code.
- **Keep Code Modular**: Write small, single-purpose functions.
- **Write Unit Tests First**: TDD helps verify that AI-generated code is correct.

The future of software engineering is incredibly bright. Embrace the tools, stay curious, and keep building!`,
      coverImage: "/images/hero-blog.png",
      tags: ["AI", "Software Engineering", "Future Tech", "Productivity"],
      published: true,
      publishedAt: new Date("2026-08-11"),
      authorId: author.id,
      categoryId: techCategory.id,
    },
    {
      title: "Mastering Color Psychology in Modern Web Design",
      slug: "mastering-color-psychology-in-modern-web-design",
      excerpt:
        "How colors influence user emotion and behavior. Learn to select harmonious palettes that evoke the right reactions and elevate your brand.",
      content: `# Mastering Color Psychology in Modern Web Design

Color is one of the most powerful tools in a designer's toolkit. Understanding the psychological effects of color helps you design websites that are not only visually striking but highly effective at driving conversions.

## The Emotional Impact of Colors

- **Blue**: Trust, security, stability.
- **Green**: Nature, health, growth.
- **Red**: Urgency, passion, energy.
- **Yellow**: Optimism, clarity, warmth.
- **Black**: Sophistication, luxury, power.

## Creating Harmonious Palettes: The 60-30-10 Rule

1. **60% Dominant Color**: Neutral color for backgrounds and major sections.
2. **30% Secondary Color**: Supports the dominant color for cards and text.
3. **10% Accent Color**: Vibrant color reserved for CTAs and links.

Color psychology isn't about rigid rules — it's about designing with intent to create resonant digital experiences.`,
      coverImage: "/images/design-blog.png",
      tags: ["Color Theory", "UX Design", "Branding", "Web Design"],
      published: true,
      publishedAt: new Date("2026-08-08"),
      authorId: designAuthor.id,
      categoryId: designCategory.id,
    },
    {
      title: "Building Scalable Tailwind CSS Design Systems",
      slug: "building-scalable-tailwind-css-design-systems",
      excerpt:
        "Discover best practices for organizing utility classes, configuring custom tokens, and keeping your codebase clean as your team grows.",
      content: `# Building Scalable Tailwind CSS Design Systems

Tailwind CSS has revolutionized the way we write styles. Without a clear strategy, a rapidly growing codebase can become cluttered with inconsistent spacing and duplicated components.

## 1. Leverage the Configuration File

Avoid using arbitrary values. Define tokens in your \`tailwind.config.ts\`:

\`\`\`typescript
export default {
  theme: {
    extend: {
      spacing: { '13': '3.25rem' },
      borderRadius: { 'premium': '1.25rem' }
    }
  }
}
\`\`\`

## 2. Embrace Component Extraction

Extract repeated utility class patterns into dedicated components for a single source of truth.

## 3. Style with HSL Custom Colors

Using CSS variables combined with HSL values allows for dynamic themes and easy opacity control.`,
      coverImage: "/images/tech-blog.png",
      tags: ["Tailwind CSS", "Design Systems", "Frontend", "React"],
      published: true,
      publishedAt: new Date("2026-08-05"),
      authorId: author.id,
      categoryId: techCategory.id,
    },
    {
      title: "Designing Your Ideal Workspace for Productivity",
      slug: "designing-your-ideal-workspace-for-productivity",
      excerpt:
        "A guide to ergonomics, lighting, and layout principles to create a physical environment that fosters focus and inspiration.",
      content: `# Designing Your Ideal Workspace for Productivity

Your physical environment has a direct impact on your mental focus, creativity, and physical energy.

## 1. Optimize Ergonomics First

- **Monitor Height**: Eyes should align with the top third of your screen.
- **Elbow Angle**: Keep elbows bent at roughly 90 degrees while typing.
- **Chair Support**: Invest in a chair with active lumbar support.

## 2. Master the Lighting

- **Prioritize Natural Light**: Place your desk perpendicular to a window.
- **Task Lighting**: Use an adjustable desk lamp with warm light (2700K - 3000K).
- **Minimize Reflection**: Avoid overhead lights directly behind you.

## 3. Clear the Clutter

Visual clutter competes for your brain's attention. Keep only active projects on your desk and introduce a small plant for a stress-reducing touch of nature.`,
      coverImage: "/images/lifestyle-blog.png",
      tags: ["Productivity", "Workspace", "Ergonomics", "Lifestyle"],
      published: true,
      publishedAt: new Date("2026-08-02"),
      authorId: lifestyleAuthor.id,
      categoryId: lifestyleCategory.id,
    },
    {
      title: "Minimalist Habits for Sustainable Living",
      slug: "minimalist-habits-for-sustainable-living",
      excerpt:
        "Simple, practical habits that help reduce waste, declutter your lifestyle, and make more intentional, eco-friendly choices every day.",
      content: `# Minimalist Habits for Sustainable Living

Minimalism and sustainability are two sides of the same coin. Both encourage us to buy less, care more, and live intentionally.

## Practical Habits to Try Today

- **The 72-Hour Rule**: Wait 72 hours before any non-essential purchase.
- **Declutter with Purpose**: Donate or sell items you no longer use.
- **Choose Quality Over Quantity**: Invest in products built to last.
- **Mindful Consumption**: Opt for minimal packaging and support local businesses.

By simplifying our physical environments, we lead more peaceful and environmentally friendly lives.`,
      coverImage: "/images/lifestyle-blog.png",
      tags: ["Minimalism", "Sustainability", "Lifestyle", "Eco-Friendly"],
      published: true,
      publishedAt: new Date("2026-07-28"),
      authorId: lifestyleAuthor.id,
      categoryId: lifestyleCategory.id,
    },
    {
      title: "The Evolution of Minimalist Typography",
      slug: "the-evolution-of-minimalist-typography",
      excerpt:
        "A deep dive into the history of Swiss design, the rise of neo-grotesque typefaces, and their crucial role in modern user interfaces.",
      content: `# The Evolution of Minimalist Typography

Minimalist typography is the cornerstone of modern digital interfaces. By stripping away decorative elements and focusing on structure and clarity, it allows content to communicate directly and powerfully.

## The Swiss Design Influence

In the 1950s, the International Typographic Style championed:
- Asymmetric layouts
- Mathematical grids
- Sans-serif typefaces like Helvetica

## The Neo-Grotesque Revival

Popular typefaces like Inter, Roboto, and San Francisco dominate mobile and web apps today, designed for maximum legibility on digital screens.

## Typography in UI Design

1. **Line Height**: A comfortable reading line height is between 1.5 and 1.6 for body copy.
2. **Letter Spacing**: Add a touch of letter-spacing to uppercase headers.
3. **Contrast**: Use high contrast (slate-900 on white) for body text to minimize eye fatigue.

Typography is not just about choosing a font — it's about crafting an optimal reading experience.`,
      coverImage: "/images/design-blog.png",
      tags: ["Typography", "Swiss Design", "UI Design", "Fonts"],
      published: true,
      publishedAt: new Date("2026-07-24"),
      authorId: designAuthor.id,
      categoryId: designCategory.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.create({ data: post });
  }

  console.log("✅ Posts seeded successfully");
  console.log("🎉 Database seeding complete!");
  console.log("\n📌 Admin credentials:");
  console.log("   Email:    admin@chronicle.com");
  console.log("   Password: admin1234");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
