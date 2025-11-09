"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';
import message from "@/messge.json";

export default function Home() {
  // dbConnection();
  return (
    <div className="h-screen bg-zinc-400">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12  ">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            <span className="text-black font-bold">SayMore</span> - Where your identity
            remains a secret.
          </p>
        </section>
        <Carousel className="w-full max-w-xs "plugins={[Autoplay({delay:2000})]}>
          <CarouselContent>
            {message.map((msg, index) => (
              <CarouselItem key={index} >
                <div className="p-1">
                  <Card className="bg-gray-800">
                    <CardHeader>
                      <CardTitle className="text-sky-400">{msg.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <span className="text-2xl text-cyan-400 font-semibold">
                        {msg.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
    </div>
  );
}
