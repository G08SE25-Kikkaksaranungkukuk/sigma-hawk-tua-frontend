import { ImageWithFallback } from '@/components/ImageWithFallback';
import { motion } from 'framer-motion';

interface BlogContentProps {
  content: {
    type: 'text' | 'image' | 'quote';
    content: string;
    caption?: string;
  }[];
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 mt-12 pb-16">
      <article className="prose prose-lg max-w-none">
        {content.map((block, index) => {
          if (block.type === 'text') {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-6"
              >
                <p className="text-foreground/90 leading-relaxed">{block.content}</p>
              </motion.div>
            );
          }

          if (block.type === 'image') {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="my-12 -mx-4 md:mx-0"
              >
                <div className="relative overflow-hidden rounded-xl group">
                  <ImageWithFallback
                    src={block.content}
                    alt={block.caption || 'Blog image'}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {block.caption && (
                  <p className="text-sm text-muted-foreground text-center mt-3 italic">
                    {block.caption}
                  </p>
                )}
              </motion.div>
            );
          }

          if (block.type === 'quote') {
            return (
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="my-8 pl-6 border-l-4 border-primary/30 italic text-foreground/80"
              >
                <p>"{block.content}"</p>
              </motion.blockquote>
            );
          }

          return null;
        })}
      </article>
    </div>
  );
}