import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3,
  Quote,
  Image,
  Link,
  Code,
  Plus,
  GripVertical,
  Type,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ImageCropModal } from '@/components/ImageCropModal';

interface Block {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'quote' | 'code' | 'image';
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  alignment?: 'left' | 'center' | 'right';
}

export function RichTextEditor() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'paragraph', content: '' }
  ]);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState('');
  const [currentImageBlockId, setCurrentImageBlockId] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState('');

  const addBlock = (afterId: string, type: Block['type'] = 'paragraph') => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: ''
    };
    
    const index = blocks.findIndex(b => b.id === afterId);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    
    // Focus the new block
    setTimeout(() => {
      const element = document.getElementById(`block-${newBlock.id}`);
      if (element) {
        // Clear any existing content and focus
        element.innerHTML = '';
        element.focus();
        // Place cursor at the beginning of the empty block
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(element, 0);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 10);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(prevBlocks => prevBlocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, removed);
    setBlocks(newBlocks);
  };

  const changeBlockType = (id: string, type: Block['type']) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, type } : b));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length === 1) return;
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateImageBlock = (id: string, imageUrl: string, imageAlt?: string) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(b => 
        b.id === id ? { ...b, imageUrl, imageAlt } : b
      )
    );
  };

  const updateBlockAlignment = (id: string, alignment: 'left' | 'center' | 'right') => {
    setBlocks(prevBlocks => 
      prevBlocks.map(b => 
        b.id === id ? { ...b, alignment } : b
      )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a URL for the image and open crop modal
    const imageUrl = URL.createObjectURL(file);
    setCropImageUrl(imageUrl);
    setCurrentImageBlockId(blockId);
    setOriginalFileName(file.name);
    setCropModalOpen(true);
    
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const handleCropComplete = (croppedImageUrl: string, croppedFile: File) => {
    if (currentImageBlockId) {
      updateImageBlock(currentImageBlockId, croppedImageUrl, croppedFile.name);
    }
    setCropModalOpen(false);
    setCropImageUrl('');
    setCurrentImageBlockId(null);
    setOriginalFileName('');
  };

  const handleCropCancel = () => {
    // Clean up the original image URL
    if (cropImageUrl) {
      URL.revokeObjectURL(cropImageUrl);
    }
    setCropModalOpen(false);
    setCropImageUrl('');
    setCurrentImageBlockId(null);
    setOriginalFileName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    // Handle key events for blocks
    // Removed Shift+Enter functionality for creating new blocks
  };

  const renderBlock = (block: Block) => {
    const getAlignmentClass = (alignment?: string) => {
      switch (alignment) {
        case 'center': return 'text-center';
        case 'right': return 'text-right';
        default: return 'text-left';
      }
    };
    
    const commonClasses = "w-full outline-none px-2 py-1.5 rounded hover:bg-accent/50 focus:bg-accent/50 transition-colors";
    const alignmentClass = getAlignmentClass(block.alignment);
    
    const props = {
      id: `block-${block.id}`,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        const currentContent = e.currentTarget.innerHTML || '';
        updateBlock(block.id, currentContent);
      },
      onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, block.id),
      onFocus: () => setActiveBlock(block.id),
      className: `${commonClasses} ${alignmentClass}`,
      'data-placeholder': block.content === '' ? getPlaceholder(block.type) : undefined
    };

    switch (block.type) {
      case 'heading1':
        return <h1 {...props} className={`${commonClasses} ${alignmentClass} text-4xl font-semibold`} dangerouslySetInnerHTML={{ __html: block.content }} />;
      case 'heading2':
        return <h2 {...props} className={`${commonClasses} ${alignmentClass} text-3xl font-semibold`} dangerouslySetInnerHTML={{ __html: block.content }} />;
      case 'heading3':
        return <h3 {...props} className={`${commonClasses} ${alignmentClass} text-2xl font-semibold`} dangerouslySetInnerHTML={{ __html: block.content }} />;
      case 'quote':
        return (
          <blockquote className={`border-l-4 border-primary pl-4 italic ${alignmentClass}`}>
            <div {...props} dangerouslySetInnerHTML={{ __html: block.content }} />
          </blockquote>
        );
      case 'code':
        return <pre {...props} className={`${commonClasses} ${alignmentClass} font-mono bg-muted p-4 rounded-lg overflow-x-auto`} dangerouslySetInnerHTML={{ __html: block.content }} />;
      case 'image':
        return (
          <div className="relative group text-center">
            {block.imageUrl ? (
              <div className="relative inline-block">
                <img 
                  src={block.imageUrl} 
                  alt={block.imageAlt || 'Uploaded image'}
                  className="max-w-full h-auto rounded-lg"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1 bg-black/80 rounded p-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, block.id)}
                      className="hidden"
                      id={`image-replace-${block.id}`}
                    />
                    <label
                      htmlFor={`image-replace-${block.id}`}
                      className="p-1 text-white hover:bg-white/20 rounded cursor-pointer"
                      title="Replace image"
                    >
                      <Image className="h-4 w-4" />
                    </label>
                    <button
                      onClick={() => updateImageBlock(block.id, '', '')}
                      className="p-1 text-white hover:bg-white/20 rounded"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <div 
                    {...props} 
                    className={`${commonClasses} text-sm text-muted-foreground italic`}
                    data-placeholder="Add a caption..."
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">Click to add an image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, block.id)}
                  className="hidden"
                  id={`image-upload-${block.id}`}
                />
                <label
                  htmlFor={`image-upload-${block.id}`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                >
                  Upload Image
                </label>
              </div>
            )}
          </div>
        );
      default:
        return <p {...props} dangerouslySetInnerHTML={{ __html: block.content }} />;
    }
  };

  const getPlaceholder = (type: Block['type']) => {
    switch (type) {
      case 'heading1': return "Heading 1";
      case 'heading2': return "Heading 2";
      case 'heading3': return "Heading 3";
      case 'quote': return "Quote";
      case 'code': return "Code";
      case 'image': return "Add a caption...";
      default: return "Type here...";
    }
  };

  const DraggableBlock = ({ block, index }: { block: Block; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
      type: 'BLOCK',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'BLOCK',
      hover: (item: { index: number }) => {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        
        moveBlock(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    drag(drop(ref));

    return (
      <div
        ref={ref}
        className={`group flex gap-2 items-start relative ${isDragging ? 'opacity-50' : ''}`}
      >
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -left-38 top-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 bg-gray-900/50 backdrop-blur-sm border-gray-700" align="start">
              <div className="text-xs text-orange-300 px-2 py-1.5 mb-1">Add block below</div>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => addBlock(block.id, 'paragraph')}
                >
                  <Type className="h-4 w-4 mr-2" />
                  Text
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => addBlock(block.id, 'heading1')}
                >
                  <Heading1 className="h-4 w-4 mr-2" />
                  Heading 1
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => addBlock(block.id, 'heading2')}
                >
                  <Heading2 className="h-4 w-4 mr-2" />
                  Heading 2
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => addBlock(block.id, 'heading3')}
                >
                  <Heading3 className="h-4 w-4 mr-2" />
                  Heading 3
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => addBlock(block.id, 'quote')}
                >
                  <Quote className="h-4 w-4 mr-2" />
                  Quote
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => addBlock(block.id, 'code')}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => addBlock(block.id, 'image')}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Image
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-grab active:cursor-grabbing">
                <GripVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 bg-gray-900/50 backdrop-blur-sm border-gray-700" align="start">
              <div className="text-xs text-orange-300 px-2 py-1.5 mb-1">Turn into</div>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => changeBlockType(block.id, 'paragraph')}
                >
                  <Type className="h-4 w-4 mr-2" />
                  Text
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => changeBlockType(block.id, 'heading1')}
                >
                  <Heading1 className="h-4 w-4 mr-2" />
                  Heading 1
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => changeBlockType(block.id, 'heading2')}
                >
                  <Heading2 className="h-4 w-4 mr-2" />
                  Heading 2
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => changeBlockType(block.id, 'heading3')}
                >
                  <Heading3 className="h-4 w-4 mr-2" />
                  Heading 3
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => changeBlockType(block.id, 'quote')}
                >
                  <Quote className="h-4 w-4 mr-2" />
                  Quote
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => changeBlockType(block.id, 'code')}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:text-orange-400 hover:bg-orange-400/10"
                  onClick={() => changeBlockType(block.id, 'image')}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Image
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignLeft className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 bg-gray-900/50 backdrop-blur-sm border-gray-700" align="start">
              <div className="text-xs text-orange-300 px-2 py-1.5 mb-1">Text alignment</div>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start ${block.alignment === 'left' || !block.alignment ? 'bg-orange-400/20 text-orange-400' : 'text-white hover:text-orange-400 hover:bg-orange-400/10'}`}
                  onClick={() => updateBlockAlignment(block.id, 'left')}
                >
                  <AlignLeft className="h-4 w-4 mr-2" />
                  Left
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start ${block.alignment === 'center' ? 'bg-orange-400/20 text-orange-400' : 'text-white hover:text-orange-400 hover:bg-orange-400/10'}`}
                  onClick={() => updateBlockAlignment(block.id, 'center')}
                >
                  <AlignCenter className="h-4 w-4 mr-2" />
                  Center
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start ${block.alignment === 'right' ? 'bg-orange-400/20 text-orange-400' : 'text-white hover:text-orange-400 hover:bg-orange-400/10'}`}
                  onClick={() => updateBlockAlignment(block.id, 'right')}
                >
                  <AlignRight className="h-4 w-4 mr-2" />
                  Right
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => deleteBlock(block.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1">
          {renderBlock(block)}
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-4xl mx-auto">
        <style>{`
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
          }
          [contenteditable]:focus {
            outline: none;
          }
        `}</style>
        
        <div className="space-y-1">
          {blocks.map((block, index) => (
            <DraggableBlock key={block.id} block={block} index={index} />
          ))}
        </div>
        
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={handleCropCancel}
          imageUrl={cropImageUrl}
          onCropComplete={handleCropComplete}
          fileName={originalFileName}
        />
      </div>
    </DndProvider>
  );
}