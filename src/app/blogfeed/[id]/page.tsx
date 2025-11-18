'use client';

import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogContent } from '@/components/blog/BlogContent';
import { CommentsSection } from '@/components/blog/CommentsSection';

export default function App() {
  const blogData = {
    title: 'Discovering the Magic of Santorini: A Journey Through Greece\'s Most Iconic Island',
    author: {
      name: 'Sarah Mitchell',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      role: 'Travel Writer & Photographer',
    },
    publishDate: 'September 15, 2025',
    readTime: '8 min read',
    likes: 2847,
    tags: ['Greece', 'Travel', 'Mediterranean', 'Island Life'],
    coverImage: 'https://images.unsplash.com/photo-1611761635679-f9a54798ea16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2UlMjB0cmF2ZWx8ZW58MXx8fHwxNzU5MTM4NzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  };

  const comments = [
    {
      id: 1,
      author: {
        name: 'Emma Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      },
      content: 'This is absolutely stunning! I visited Santorini last summer and your article perfectly captures the magic of the island. The sunset views from Oia are truly unmatched.',
      timestamp: '2 hours ago',
      likes: 24,
      replies: [
        {
          id: 4,
          author: {
            name: 'Michael Chen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          },
          content: 'I couldn\'t agree more! The sunsets there are absolutely breathtaking. Did you get a chance to try the local wine?',
          timestamp: '1 hour ago',
          likes: 8,
        },
      ],
    },
    {
      id: 2,
      author: {
        name: 'David Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      },
      content: 'Great tips on the beaches! I had no idea about the Red Beach near Akrotiri. Adding this to my travel bucket list for next year.',
      timestamp: '5 hours ago',
      likes: 15,
    },
    {
      id: 3,
      author: {
        name: 'Sophie Laurent',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      },
      content: 'The food section made me so hungry! 😋 Tomato keftedes are absolutely delicious. If anyone visits, make sure to try them at Metaxi Mas restaurant in Exo Gonia - they make the best ones!',
      timestamp: '8 hours ago',
      likes: 32,
      replies: [
        {
          id: 5,
          author: {
            name: 'James Wilson',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
          },
          content: 'Thanks for the recommendation! I\'m planning my trip for October and definitely noting this down.',
          timestamp: '6 hours ago',
          likes: 5,
        },
      ],
    },
  ];

  const contentBlocks = [
    {
      type: 'text' as const,
      content: 'Santorini, the jewel of the Aegean Sea, has captured the hearts of travelers for centuries. With its iconic white-washed buildings perched atop dramatic cliffs, stunning sunsets that paint the sky in shades of orange and pink, and crystal-clear waters that sparkle under the Mediterranean sun, this Greek island offers an experience unlike any other.',
    },
    {
      type: 'text' as const,
      content: 'My journey began in the charming village of Oia, where narrow cobblestone streets wind through a maze of boutique hotels, art galleries, and traditional tavernas. The architecture here is distinctly Cycladic, with buildings carved into the volcanic rock and painted in brilliant white with blue-domed churches that have become synonymous with Greek island beauty.',
    },
    {
      type: 'image' as const,
      content: 'https://images.unsplash.com/photo-1580420180522-d7eb68a63396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGVycmFuZWFuJTIwY29hc3RhbCUyMHZpbGxhZ2V8ZW58MXx8fHwxNzU5MjQ1NzM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      caption: 'The picturesque streets of Oia village at golden hour',
    },
    {
      type: 'text' as const,
      content: 'One of the most memorable aspects of visiting Santorini is the food. Greek cuisine on the island is a celebration of fresh, local ingredients. From perfectly grilled octopus and vibrant Greek salads to the famous tomato keftedes (tomato fritters) unique to Santorini, every meal is an adventure for the palate. The local wines, particularly the Assyrtiko variety, are exceptional and pair beautifully with the seafood dishes.',
    },
    {
      type: 'quote' as const,
      content: 'Santorini doesn\'t just capture your eyes, it captures your soul. Every corner reveals a new masterpiece, every moment feels like a dream.',
    },
    {
      type: 'image' as const,
      content: 'https://images.unsplash.com/photo-1623169495515-0d6073ec0723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlayUyMGZvb2QlMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NTkyNDU3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      caption: 'Traditional Greek mezze spread featuring local delicacies',
    },
    {
      type: 'text' as const,
      content: 'The beaches of Santorini are unlike any others in Greece. The volcanic origins of the island mean you\'ll find unique black and red sand beaches that offer a stark but beautiful contrast to the typical golden beaches of the Mediterranean. Perissa and Kamari beaches offer black sand and excellent swimming, while the Red Beach near Akrotiri provides a more dramatic and secluded experience.',
    },
    {
      type: 'text' as const,
      content: 'Beyond the beaches and villages, the ancient ruins of Akrotiri offer a fascinating glimpse into the island\'s history. This Bronze Age settlement, preserved under volcanic ash, has been called the "Minoan Pompeii" and provides remarkable insights into life on the island over 3,600 years ago.',
    },
    {
      type: 'image' as const,
      content: 'https://images.unsplash.com/photo-1636558340223-c46c628cb7c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBvY2VhbiUyMHZpZXd8ZW58MXx8fHwxNzU5MjQ1NzM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      caption: 'The legendary Santorini sunset viewed from a cliffside terrace',
    },
    {
      type: 'text' as const,
      content: 'As the sun sets on my final evening in Santorini, I find myself on a terrace overlooking the caldera, watching as the sky transforms into a canvas of brilliant colors. The legendary Santorini sunset lives up to its reputation, and I understand why this island has become one of the world\'s most sought-after destinations. It\'s not just the beauty – it\'s the feeling of timelessness, the perfect blend of natural wonder and human creativity that makes Santorini truly magical.',
    },
    {
      type: 'text' as const,
      content: 'Whether you\'re seeking romance, adventure, relaxation, or cultural enrichment, Santorini delivers on all fronts. It\'s a place that stays with you long after you\'ve left, calling you back to its sun-drenched shores and unforgettable vistas. If you\'ve been dreaming of visiting Greece, make Santorini your first stop – you won\'t be disappointed.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12">
        <BlogHeader
          title={blogData.title}
          author={blogData.author}
          publishDate={blogData.publishDate}
          readTime={blogData.readTime}
          likes={blogData.likes}
          tags={blogData.tags}
          coverImage={blogData.coverImage}
        />
        
        <BlogContent content={contentBlocks} />
        
        <CommentsSection comments={comments} />
      </main>
    </div>
  );
}