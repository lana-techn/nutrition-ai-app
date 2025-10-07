import { Button } from "@/components/ui/button";

interface About3Props {
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src: string;
    alt: string;
  }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
}

const defaultCompanies = [
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-1.svg",
    alt: "Arc",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-2.svg",
    alt: "Descript",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-3.svg",
    alt: "Mercury",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-4.svg",
    alt: "Ramp",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-5.svg",
    alt: "Retool",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-6.svg",
    alt: "Watershed",
  },
];

const defaultAchievements = [
  { label: "Companies Supported", value: "300+" },
  { label: "Projects Finalized", value: "800+" },
  { label: "Happy Customers", value: "99%" },
  { label: "Recognized Awards", value: "10+" },
];

export const About3 = ({
  title = "About Us",
  description = "Nutrition AI is a passionate team dedicated to creating innovative solutions that empower individuals to thrive in their health journey through AI-powered nutrition insights.",
  mainImage = {
    src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    alt: "Healthy nutrition and lifestyle",
  },
  secondaryImage = {
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    alt: "Fresh healthy foods",
  },
  breakout = {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    alt: "AI nutrition logo",
    title: "Thousands of users at NutritionAI.app",
    description: "Providing individuals with effective tools to improve nutrition habits, boost health metrics, and encourage sustainable lifestyle changes.",
    buttonText: "Discover more",
    buttonUrl: "#",
  },
  companiesTitle = "Trusted by health enthusiasts worldwide",
  companies = defaultCompanies,
  achievementsTitle = "Our Achievements in Numbers",
  achievementsDescription = "Providing individuals with effective tools to improve nutrition habits, boost health metrics, and encourage sustainable lifestyle changes through AI-powered insights.",
  achievements = defaultAchievements,
}: About3Props = {}) => {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-14 grid gap-8 text-center md:grid-cols-2 md:text-left">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed font-medium">
            {description}
          </p>
        </div>
        
        <div className="grid gap-7 lg:grid-cols-3">
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl group">
            <img
              src={mainImage.src}
              alt={mainImage.alt}
              className="size-full max-h-[620px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-2xl bg-card p-8 md:w-1/2 lg:w-auto border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <img
                  src={breakout.src}
                  alt={breakout.alt}
                  className="w-8 h-8 rounded-lg"
                />
              </div>
              
              <div className="space-y-3">
                <p className="text-lg font-semibold text-foreground">
                  {breakout.title}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {breakout.description}
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="mr-auto rounded-xl border-2 hover:bg-accent/5 hover:border-accent transition-all duration-300" 
                asChild
              >
                <a href={breakout.buttonUrl} target="_blank">
                  {breakout.buttonText}
                </a>
              </Button>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl group md:w-1/2 lg:w-auto lg:min-h-0">
              <img
                src={secondaryImage.src}
                alt={secondaryImage.alt}
                className="w-full h-full min-h-[200px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
        
        <div className="py-32">
          <p className="text-center text-muted-foreground font-medium mb-8">
            {companiesTitle}
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {companies.map((company, idx) => (
              <div 
                className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300" 
                key={company.src + idx}
              >
                <img
                  src={company.src}
                  alt={company.alt}
                  className="h-6 w-auto md:h-8 filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl bg-card p-10 md:p-16 border border-border/50 shadow-lg">
          <div className="flex flex-col gap-6 text-center md:text-left">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-highlight bg-clip-text text-transparent">
              {achievementsTitle}
            </h2>
            <p className="max-w-screen-sm text-muted-foreground text-lg leading-relaxed">
              {achievementsDescription}
            </p>
          </div>
          
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((item, idx) => (
              <div className="text-center space-y-3 group cursor-pointer" key={item.label + idx}>
                <div className="space-y-2">
                  <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
                    {item.value}
                  </span>
                  <p className="text-sm text-muted-foreground font-medium">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Decorative grid pattern */}
          <div className="pointer-events-none absolute -top-1 right-1 z-10 hidden h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted-foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted-foreground))_1px,transparent_1px)] bg-[size:80px_80px] opacity-5 [mask-image:linear-gradient(to_bottom_right,#000,transparent,transparent)] md:block"></div>
        </div>
      </div>
    </section>
  );
};