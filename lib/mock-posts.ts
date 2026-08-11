import { BlogPost } from "@/types/blog";

export const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "navigating-the-future-of-ai-development",
    title: "Navigating the Future of AI Development",
    excerpt: "Explore the shifting landscape of software engineering in the age of generative AI, and learn how to adapt and thrive as a modern developer.",
    date: "August 11, 2026",
    category: "Technology",
    readingTime: "5 min read",
    coverImage: "/images/hero-blog.png",
    featured: true,
    author: {
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      role: "Lead Software Architect"
    },
    content: `
# Navigating the Future of AI Development

The intersection of software engineering and artificial intelligence is shifting faster than ever before. As generative AI models become integrated into our IDEs, documentation, and deployment workflows, the role of the modern developer is fundamentally changing.

It is no longer just about writing code; it is about **orchestrating systems, designing clean architectures, and understanding how to pair program with intelligent agents.**

## The Paradigm Shift in Engineering

For decades, coding was about syntax, compilers, and debugging loops. While these fundamentals still matter, AI assistants can now generate code blocks in seconds. This shifts the bottleneck of software development from *writing* code to *verifying and designing* code.

As developers, we are moving from being creators of syntax to **system architects and code reviewers.**

### Key Skills for the AI Era:

1. **Prompt Engineering & Context Design**: Providing the right instructions and codebase context to AI models.
2. **Architectural Thinking**: Designing modular, testable, and decoupled codebases so that AI agents can easily understand and edit them.
3. **Rigorous Code Review**: Reading AI-generated code with a critical eye, ensuring it adheres to security, performance, and style guidelines.
4. **Domain-Specific Knowledge**: Deep understanding of business logic and system integration, where AI model context is often limited.

---

## Pair Programming with AI: Best Practices

To get the most out of your AI-driven workflow, consider these practices:

> "The best developers use AI not as a replacement for thinking, but as a catalyst for deeper planning and rapid execution."

* **Plan Before You Prompt**: Spend 80% of your time designing and 20% writing. Outline dependencies, data models, and edge cases before generating code.
* **Keep Code Modular**: Write small, single-purpose functions. Large, monolithic functions confuse AI models and lead to buggy completions.
* **Write Unit Tests First**: Using Test-Driven Development (TDD) helps you verify that AI-generated code is correct and safe to merge.

## Looking Ahead

The future of software engineering is incredibly bright. Rather than replacing developers, AI will democratize software creation, allowing engineers to focus on higher-level problem solving, user experience, and robust system integration.

Embrace the tools, stay curious, and keep building!
`
  },
  {
    id: "2",
    slug: "mastering-color-psychology-in-modern-web-design",
    title: "Mastering Color Psychology in Modern Web Design",
    excerpt: "How colors influence user emotion and behavior. Learn how to select harmonious palettes that evoke the right reactions and elevate your brand's digital presence.",
    date: "August 8, 2026",
    category: "Design",
    readingTime: "4 min read",
    coverImage: "/images/design-blog.png",
    author: {
      name: "Sophia Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      role: "Senior UI/UX Designer"
    },
    content: `
# Mastering Color Psychology in Modern Web Design

Color is one of the most powerful tools in a designer’s toolkit. It does more than make a website look beautiful; it communicates values, establishes visual hierarchy, and influences user behavior.

Understanding the psychological effects of color can help you design websites that are not only visually striking but also highly effective at driving conversions.

## The Emotional Impact of Colors

Every color evokes a distinct emotional response from users. Here is a breakdown of the primary colors and their typical psychological associations:

* **Blue**: Trust, security, stability. Often used by financial, healthcare, and technology brands (e.g., PayPal, Intel).
* **Green**: Nature, health, growth, tranquility. Popular in wellness, organic food, and sustainability websites.
* **Red**: Urgency, passion, energy. Excellent for call-to-action buttons or clearance sales, but should be used sparingly to avoid causing user anxiety.
* **Yellow**: Optimism, clarity, warmth. Great for grabbing attention, but hard on the eyes if overused.
* **Black/Dark Slate**: Sophistication, luxury, power. Frequently chosen for high-end fashion, portfolios, and premium product designs.

---

## Creating Harmonious Palettes

When building a color palette, simplicity is key. A common rule of thumb is the **60-30-10 Rule**:

1. **60% Dominant Color**: Typically a neutral color used for backgrounds and major sections (gives the design structure).
2. **30% Secondary Color**: Supports the dominant color and is used for cards, text, and structural elements.
3. **10% Accent Color**: A vibrant, contrasting color reserved exclusively for call-to-actions, links, and highlighted elements.

### Example Palette (Sleek Dark Mode):
* **Dominant (60%)**: Deep slate gray (#0F172A)
* **Secondary (30%)**: Frosted Glass / Soft violet (#7C3AED)
* **Accent (10%)**: Vibrant Cyan (#06B6D4)

## Conclusion

Color psychology isn't about rigid rules—it is about understanding user expectations and designing with intent. By pairing psychological insights with clean layouts, you can create digital experiences that truly resonate with your audience.
`
  },
  {
    id: "3",
    slug: "building-scalable-tailwind-css-design-systems",
    title: "Building Scalable Tailwind CSS Design Systems",
    excerpt: "Discover best practices for organizing utility classes, configuring custom tokens, and keeping your codebase clean as your development team grows.",
    date: "August 5, 2026",
    category: "Technology",
    readingTime: "6 min read",
    coverImage: "/images/tech-blog.png",
    author: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      role: "Frontend Team Lead"
    },
    content: `
# Building Scalable Tailwind CSS Design Systems

Tailwind CSS has revolutionized the way we write styles. However, without a clear strategy, a rapidly growing codebase can quickly become cluttered with inconsistent spacing, arbitrary values, and duplicated components.

Here is a guide on how to build a scalable and maintainable design system using Tailwind CSS v3.

## 1. Leverage the Configuration File

Avoid using arbitrary values like \`p-[13px]\` or \`w-[342px]\` in your markup. Instead, define these as tokens in your \`tailwind.config.ts\`:

\`\`\`typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      spacing: {
        '13': '3.25rem', // Define standard spacing rules
      },
      borderRadius: {
        'premium': '1.25rem', // Uniform styling curves
      }
    }
  }
} satisfies Config
\`\`\`

By configuring custom tokens, you ensure design consistency and make it easy to perform global style changes later.

## 2. Embrace Component Extraction

If you find yourself writing the same list of utility classes for buttons or inputs, it is time to extract them into reusable components.

### Avoid:
\`\`\`tsx
<button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md">
  Submit
</button>
\`\`\`

### Better:
Extract this into a dedicated button component. This keeps your layout code clean and ensures there is a single source of truth for your interactive elements.

---

## 3. Style with HSL Custom Colors

Using CSS variables combined with HSL values in Tailwind allows for easy tint/shade adjustments and dynamic themes:

\`\`\`css
/* globals.css */
:root {
  --primary: 262 83% 58%; /* HSL for purple */
}
\`\`\`

\`\`\`typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary) / <alpha-value>)',
      }
    }
  }
}
\`\`\`

This approach allows you to change opacity dynamically in Tailwind (\`bg-primary/50\`) while maintaining full color synchronization.
`
  },
  {
    id: "4",
    slug: "designing-your-ideal-workspace-for-productivity",
    title: "Designing Your Ideal Workspace for Productivity",
    excerpt: "A guide to ergonomics, lighting, and layout principles to create a physical environment that fosters focus, inspiration, and physical well-being.",
    date: "August 2, 2026",
    category: "Lifestyle",
    readingTime: "3 min read",
    coverImage: "/images/lifestyle-blog.png",
    author: {
      name: "Emma Watson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      role: "Wellness Coach & Writer"
    },
    content: `
# Designing Your Ideal Workspace for Productivity

Your physical environment has a direct, profound impact on your mental focus, creativity, and physical energy. Whether you are working from a corporate office or a cozy home setup, optimizing your workspace is an investment in your career and health.

Here are three core design principles to transform your desk into a productivity sanctuary.

## 1. Optimize Ergonomics First

A beautiful office is useless if it leaves you with chronic back or wrist pain. 

* **Monitor Height**: Your eyes should align with the top third of your screen when sitting up straight.
* **Elbow Angle**: Keep your elbows bent at roughly 90 degrees while typing.
* **Chair Support**: Invest in a chair with active lumbar support that keeps your spine in its natural curve.

---

## 2. Master the Lighting

Poor lighting is a primary cause of headaches, eye strain, and fatigue.

1. **Prioritize Natural Light**: Place your desk perpendicular to a window to enjoy natural light without dealing with direct glare on your screen.
2. **Task Lighting**: Use an adjustable desk lamp with warm light (around 2700K - 3000K) for focused tasks, and cool white light (4000K) during high-focus morning work.
3. **Minimize Reflection**: Avoid placing overhead lights directly behind you, as this creates reflection glare on monitor surfaces.

## 3. Clear the Clutter (Visual & Mental)

Visual clutter competes for your brain’s attention resources. Implement a "minimalist desk policy":

* Keep only active projects on your desk.
* Use under-desk cable management trays to hide cords.
* Introduce a small touch of nature—a snake plant or succulent can reduce stress and improve air quality.

By creating an environment designed for comfort and focus, you set yourself up for daily creative flow.
`
  },
  {
    id: "5",
    slug: "minimalist-habits-for-sustainable-living",
    title: "Minimalist Habits for Sustainable Living",
    excerpt: "Simple, practical habits that help reduce waste, declutter your lifestyle, and make more intentional, eco-friendly choices every day.",
    date: "July 28, 2026",
    category: "Lifestyle",
    readingTime: "5 min read",
    coverImage: "/images/lifestyle-blog.png",
    author: {
      name: "Emma Watson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      role: "Wellness Coach & Writer"
    },
    content: `
# Minimalist Habits for Sustainable Living

Minimalism and sustainability are two sides of the same coin. Both philosophies encourage us to buy less, care more for what we own, and live intentionally.

Adopting a sustainable lifestyle doesn’t require throwing away all your possessions and starting over. Instead, it is about developing subtle daily habits that gradually reduce your ecological footprint.

## Practical Habits to Try Today:

* **The 72-Hour Rule**: Before making any non-essential purchase, wait 72 hours. Often, the urge to buy will pass, saving you money and clutter.
* **Declutter with Purpose**: Donate or sell items you no longer use, returning them to the circular economy.
* **Choose Quality Over Quantity**: Invest in products that are built to last, reducing the frequency of replacements.
* **Mindful Consumption**: Opt for items with minimal packaging, and support local businesses whenever possible.

By simplifying our physical environments and consumption habits, we can lead more peaceful and environmentally friendly lives.
`
  },
  {
    id: "6",
    slug: "the-evolution-of-minimalist-typography",
    title: "The Evolution of Minimalist Typography",
    excerpt: "A deep dive into the history of Swiss design, the rise of neo-grotesque typefaces, and their crucial role in modern user interfaces.",
    date: "July 24, 2026",
    category: "Design",
    readingTime: "4 min read",
    coverImage: "/images/design-blog.png",
    author: {
      name: "Sophia Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      role: "Senior UI/UX Designer"
    },
    content: `
# The Evolution of Minimalist Typography

Minimalist typography is the cornerstone of modern digital interfaces. By stripping away decorative elements and focusing entirely on structure and clarity, minimalist typography allows content to communicate directly and powerfully.

Let’s trace the origins of this style and see how it shapes our experiences online today.

## The Swiss Design Influence

In the 1950s, a movement known as the International Typographic Style (or Swiss Design) emerged in Switzerland. Led by designers like Josef Müller-Brockmann, this style championed:

* **Asymmetric layouts**
* **The use of strict mathematical grids**
* **Sans-serif typefaces like Helvetica**

The core idea was that design should be objective and invisible, serving solely as a vehicle for the message.

---

## The Neo-Grotesque Revival

Today, we see a digital revival of these classic Swiss principles. Popular typefaces like Inter, Roboto, and San Francisco dominate mobile operating systems and web applications.

These typefaces are designed for maximum legibility on digital screens, utilizing generous x-heights and open counters to remain readable even at tiny sizes on phone screens.

## Typography in UI Design

In UI design, typography is layout. By varying font weight, size, and spacing, you create a visual path for the user’s eye to follow:

1. **Line Height**: A comfortable reading line height is between 1.5 and 1.6 for body copy.
2. **Letter Spacing**: Add a tiny bit of letter-spacing to uppercase headers to increase readability.
3. **Contrast**: Use high contrast (e.g., slate-900 on white) for body text to minimize user eye fatigue.

Typography is not just about choosing a font; it is about respecting the written word and crafting an optimal reading experience.
`
  }
];
