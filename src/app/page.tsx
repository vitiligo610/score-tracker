import Link from "next/link";
import { ArrowRight, Trophy, Users, Calendar, BarChart, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSignInUrl } from "@workos-inc/authkit-nextjs";

const featureCards = [
  {
    icon: Zap,
    title: "Live, Ball-by-Ball Scoring",
    description: "Intuitive interface for real-time match logging. Fans follow live, eliminating post-match data entry and ensuring 100% accurate statistics.",
    benefit: "Real-time engagement & data integrity",
  },
  {
    icon: Calendar,
    title: "Centralized League Management",
    description: "A single dashboard to effortlessly manage tournaments, teams, and schedules. Replaces scattered spreadsheets with one convenient location.",
    benefit: "Instant access to all league data",
  },
  {
    icon: BarChart,
    title: "Automated Statistics & Visuals",
    description: "System automatically generates detailed scorecards, league leaders, and visual performance charts, saving countless hours of manual calculation.",
    benefit: "Instant, detailed player & team insights",
  },
  {
    icon: Users,
    title: "Permanent Player & Team Profiles",
    description: "Tracks complete match history and career statistics. Fosters community and enhances player engagement as they track their milestones.",
    benefit: "Stronger community & player retention",
  },
];

export default async function LandingPage() {
  const signInUrl = await getSignInUrl();

  return (
    <div className="flex flex-col min-h-screen ">

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary mb-6 leading-tight">
                <span className="text-primary">Professionalize</span> Your Local Cricket League
              </h1>
              <p className="text-xl md:text-2xl text-foreground mb-8 max-w-3xl mx-auto">
                CricScore is the Premier Management Platform for Local Cricket Leagues.
                Replace scattered spreadsheets and paper scorebooks with one powerful,
                easy-to-use digital system.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href={signInUrl}>
                  <Button size="lg" className="text-lg px-8 py-6">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary text-primary">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-0" />

        <section className="py-16 md:py-24" id="opportunity">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary mb-4">
                  The Challenge: Administrative Overload
                </h2>
                <p className="text-lg text-foreground mb-6">
                  Managing a local cricket league is a significant administrative challenge, often relying on scattered spreadsheets, paper scorebooks, and informal communication. This manual process is time-consuming, prone to errors, and fails to provide the professional experience that modern players and fans expect.
                </p>
                <div className="flex items-center space-x-3 text-lg font-medium text-primary">
                  <Trophy className="h-5 w-5" />
                  <span className="uppercase tracking-wider">The Market is Ready for Digital</span>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary mb-4">
                  The Opportunity: Specialized Simplicity
                </h2>
                <p className="text-lg text-foreground mb-6">
                  The amateur sports market demands digital access to data. A significant gap exists for a product that is powerful enough to handle complex cricket statistics but **simple and affordable** enough for volunteer-run leagues like Shaheen Cricket Club. CricScore is built to fill this exact gap, boosting player retention and sponsorship interest.
                </p>
                <Card className="border-l-4 border-primary">
                  <CardContent className="pt-4">
                    <p className="text-sm text-foreground">Target Market:</p>
                    <p className="font-semibold">Local Cricket Clubs, Corporate Leagues, and Weekend Tournament Organizers.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 " id="features">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold tracking-tight text-primary">
                Core Features That Transform Your League
              </h2>
              <p className="mt-4 text-xl text-foreground">
                From ball-by-ball scoring to automated stats, we cover every angle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureCards.map((feature, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                >
                  <CardHeader>
                    <feature.icon className="h-8 w-8 text-primary mb-3" />
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-4">{feature.description}</p>
                    <div className="flex items-center text-sm font-semibold text-primary">
                      <Shield className="h-4 w-4 mr-1" />
                      Benefit: {feature.benefit}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-6 text-center">
            <Globe className="h-10 w-10 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-3">Web-Based, Anywhere Access</h3>
            <p className="text-xl max-w-3xl mx-auto mb-6">
              CricScore is a comprehensive, web-based platform accessible from any device (phone, tablet, or computer) with **no technical expertise required**.
            </p>
            <Link href={signInUrl}>
              <Button variant="secondary" size="lg" className="text-lg px-8 py-6 text-primary hover:text-primary/90">
                Join the Digital Movement Today
              </Button>
            </Link>
          </div>
        </section>

      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center text-sm text-foreground">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} CricScore. All rights reserved.
          </div>
          <div className="space-x-4">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}