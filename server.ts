import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Initialize server-side Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback generator for wishes if offline or Gemini API is not configured
function getFallbackManifestation(wishText: string, style: string) {
  const currentYear = new Date().getFullYear();
  const manifestYear = currentYear + Math.floor(Math.random() * 4) + 2;

  const styleProfiles: Record<string, {
    titlePrefix: string;
    headline: string;
    quote: string;
    accent: string;
    story: string;
    image: string;
  }> = {
    billionaire: {
      titlePrefix: 'Billionaire Founder & Global Icon',
      headline: `In ${manifestYear}, the world recognized your vision: Forbes cover titan and revolutionary founder.`,
      quote: 'Keep pushing in 2026—the late nights built this empire.',
      accent: '#fbbf24',
      story: `What began as a quiet dream in 2026 exploded into a multi-billion dollar legacy. By ${manifestYear}, your private jets, sustainable ventures, and global philanthropic funds redefined success.`,
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?w=900&auto=format&fit=crop&q=80'
    },
    royalty: {
      titlePrefix: 'Sovereign Majesty & Cultural Monarch',
      headline: `All hail! By ${manifestYear}, you are crowned sovereign in an empire of grace, power, and prestige.`,
      quote: 'Never doubt your crown; you were born to lead.',
      accent: '#f43f5e',
      story: `Ascending the throne in ${manifestYear}, you unified millions through fearless creativity and timeless royal elegance. Your crystal palace reigns over an era of unprecedented prosperity.`,
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80'
    },
    cyberpunk: {
      titlePrefix: 'Orbital Pioneer & Neural Architect',
      headline: `Year ${manifestYear}: Architecting humanity’s quantum civilization beyond Earth.`,
      quote: 'The future wasn’t built by waiting—it was coded by you.',
      accent: '#06b6d4',
      story: `By ${manifestYear}, your neural technology unlocked interstellar colony communications. Glowing skyline holograms across Neo-Tokyo and Mars celebrate your visionary breakthrough.`,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80'
    },
    'luxury-travel': {
      titlePrefix: 'Endless Horizon & Island Sovereign',
      headline: `Living in perpetual summer: private superyachts, secret atolls, and complete sovereign freedom in ${manifestYear}.`,
      quote: 'You broke free from the ordinary. Welcome to paradise.',
      accent: '#10b981',
      story: `Sealed in 2026, unlocked in ${manifestYear}. You now split seasons between St. Barths, Monaco, and your own private sanctuary, living life completely on your own terms.`,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80'
    },
    superstar: {
      titlePrefix: 'World Arena Icon & Grammy Champion',
      headline: `100,000 voices chanting your name under stadium lights in ${manifestYear}.`,
      quote: 'The songs you wrote in the dark are now lighting up the world.',
      accent: '#ec4899',
      story: `From a bold wish in 2026 to global headliner status by ${manifestYear}. Your stadium world tour shattered records, inspiring a new generation to manifest their greatest dreams.`,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80'
    }
  };

  const profile = styleProfiles[style] || styleProfiles.billionaire;

  return {
    manifestYear,
    visionTitle: `${profile.titlePrefix}`,
    prophecyHeadline: profile.headline,
    prophecyStory: profile.story,
    futureSelfQuote: profile.quote,
    accentColor: profile.accent,
    imageUrl: profile.image,
    soundscape: 'Cinematic orchestral swell with resonant future synth arpeggios'
  };
}

// POST endpoint to generate an AI Future Wish
app.post('/api/wish/generate', async (req, res) => {
  const { wishText, style } = req.body;
  const cleanWish = (wishText || 'I want to be rich and travel the world').trim();
  const selectedStyle = style || 'billionaire';

  // If Gemini API is available, generate dynamic prophecy & manifestation
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are the visionary dream-manifestation engine of PastSelf, a viral time-capsule video social app.
A user has written their deepest wish for their future self:
Wish: "${cleanWish}"
Aesthetic Style: "${selectedStyle}"

Return a JSON object with this exact structure:
{
  "manifestYear": (number between 2028 and 2033),
  "visionTitle": (short bold epic title, e.g. "Crowned Sovereign Queen of Neo-Avalon" or "Forbes Billionaire Founder & Tech Titan", under 45 chars),
  "prophecyHeadline": (one sensational viral sentence announcing this dream fulfilled in that year),
  "prophecyStory": (2-3 cinematic sentences describing how the wish came true and how amazing life is),
  "futureSelfQuote": (1 powerful inspiring quote from future self back to 2026 user),
  "accentColor": (hex color code matching vibe, e.g. #fbbf24, #f43f5e, #06b6d4, #10b981, #ec4899)
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.85
        }
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText.trim());

      const fallback = getFallbackManifestation(cleanWish, selectedStyle);

      return res.json({
        success: true,
        manifestYear: parsed.manifestYear || fallback.manifestYear,
        visionTitle: parsed.visionTitle || fallback.visionTitle,
        prophecyHeadline: parsed.prophecyHeadline || fallback.prophecyHeadline,
        prophecyStory: parsed.prophecyStory || fallback.prophecyStory,
        futureSelfQuote: parsed.futureSelfQuote || fallback.futureSelfQuote,
        accentColor: parsed.accentColor || fallback.accentColor,
        imageUrl: fallback.imageUrl,
        soundscape: fallback.soundscape
      });
    } catch (err) {
      console.warn('Gemini generateContent error, using fallback:', err);
      // Fallback seamlessly on error
      const fallback = getFallbackManifestation(cleanWish, selectedStyle);
      return res.json({ success: true, ...fallback });
    }
  }

  // Instant fallback when no API key is provided
  const fallback = getFallbackManifestation(cleanWish, selectedStyle);
  return res.json({ success: true, ...fallback });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`PastSelf Server listening at http://0.0.0.0:${port}`);
  });
}

startServer();
