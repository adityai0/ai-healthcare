"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Send, X, Bot } from "lucide-react";
import Image from "next/image";
import { useChat } from "ai/react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dynamic = "force-dynamic";

export default function VisionAI() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageContext, setImageContext] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      api: "/api/analyze",
      onFinish: () => {
        setSelectedImage(null);
        setPreviewImage(null);
        setImageContext(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Send the image file to the analyze-image route
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("/api/vision-ai", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setImageContext(data.imageContext);
      } catch (error) {
        console.error("Error analyzing image:", error);
      }
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageContext && !input.trim()) return;

    const userMessage = input || "Analyze this image";
    setInput("");

    const formData = {
      messages: [{ role: "user", content: userMessage }],
      imageContext: imageContext,
    };

    handleSubmit(event, { data: formData });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-svh bg-[#343541] text-white w-full">
      <header className="p-4">
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          Vision<span className="text-yellow-300">AI</span> Health Analyzer
        </h1>
      </header>

      <main className="flex-grow overflow-auto p-4 space-y-4 md:px-32">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user" ? "bg-[#5c5c72]" : "bg-[#444654]"
              }`}
            >
              <div className="flex items-center">
                {message.role === "user" ? null : (
                  <Bot className="h-5 w-5 mr-2" />
                )}
                <span className="font-semibold">
                  {message.role === "user" ? "You" : "VisionAI"}
                </span>
              </div>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>

      <footer className="p-4 w-full md:w-3/4 mx-auto">
        <form onSubmit={handleFormSubmit} className="flex items-end space-x-2">
          <div className="flex-grow space-y-2">
            <input
              type="text"
              className="w-full px-3 py-2 text-white bg-[#40414f] rounded-lg focus:outline-none"
              placeholder="Describe any symptoms or concerns..."
              value={input}
              onChange={handleInputChange}
            />
          </div>

          <label
            htmlFor="image-upload"
            className="flex items-center justify-center p-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
          >
            <Upload className="w-6 h-6" />
            <input
              id="image-upload"
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
              ref={fileInputRef}
            />
          </label>

          <button
            type="submit"
            className="flex items-center justify-center p-2 bg-[#10a37f] rounded-lg focus:outline-none"
            disabled={!imageContext && !input.trim()}
          >
            <Send className="w-6 h-6" />
          </button>
        </form>

        {previewImage && (
          <div className="mt-2 relative inline-block">
            <Image
              src={previewImage}
              alt="Selected"
              className="h-20 w-auto object-contain rounded-lg"
              width={80}
              height={80}
            />
            <button
              onClick={() => {
                setSelectedImage(null);
                setPreviewImage(null);
                setImageContext(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
