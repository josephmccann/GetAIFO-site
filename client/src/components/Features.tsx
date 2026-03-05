import { motion } from "framer-motion";
import { Zap, Globe, Shield, Code2, Server, Smartphone } from "lucide-react";

const features = [
  {
    name: "Built-in Optimizations",
    description: "Automatic image, font, and script optimizations for improved UX and Core Web Vitals.",
    icon: Zap,
  },
  {
    name: "Dynamic HTML Streaming",
    description: "Instantly stream UI from the server, integrated with the App Router and React Suspense.",
    icon: Globe,
  },
  {
    name: "React Server Components",
    description: "Add components without sending additional client-side JavaScript. Built on the latest React features.",
    icon: Server,
  },
  {
    name: "Data Fetching",
    description: "Make your React components async and await your data. Next.js supports both server and client data fetching.",
    icon: Code2,
  },
  {
    name: "CSS Support",
    description: "Style your application with your favorite tools, including Tailwind CSS, CSS Modules, and more.",
    icon: Smartphone,
  },
  {
    name: "Route Handlers",
    description: "Build API endpoints to securely connect with third-party services for your frontend app.",
    icon: Shield,
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-black relative border-t border-white/10">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight" data-testid="text-features-title">
            The power of React. <br className="hidden md:block" />
            <span className="text-gradient">The framework you love.</span>
          </h2>
          <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl" data-testid="text-features-subtitle">
            Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-colors"
              data-testid={`card-feature-${index}`}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/10 text-white mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.name}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}