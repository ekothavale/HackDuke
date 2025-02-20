import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CssBaseline,
  IconButton,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  Divider,
  Skeleton,
  Tabs,
  Tab,
  Chip
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BarChartIcon from "@mui/icons-material/BarChart";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ArticleIcon from "@mui/icons-material/Article";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ForumIcon from "@mui/icons-material/Forum";
import TwitterIcon from "@mui/icons-material/Twitter";
import InsightsIcon from "@mui/icons-material/Insights";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define TypeScript types
interface Stock {
  id: number;
  ticker: string;
  name: string;
  description: string;
}

interface Category {
  label: string;
  icon: JSX.Element;
}

interface NewsArticle {
  title: string;
  snippet: string;
  url: string;
  sentiment: string;
  source: string;
}

// Sample data for stocks
const nasdaqCompanies: Stock[] = [
  { id: 1, ticker: "AAPL", name: "Apple Inc.", description: "Technology - Apple Inc." },
  { id: 2, ticker: "MSFT", name: "Microsoft Corp.", description: "Technology - Microsoft Corp." },
  { id: 3, ticker: "AMZN", name: "Amazon.com Inc.", description: "E-commerce and Cloud Computing" },
  { id: 4, ticker: "GOOGL", name: "Alphabet Inc.", description: "Technology - Parent company of Google" },
  { id: 5, ticker: "TSLA", name: "Tesla Inc.", description: "Automotive and Energy Solutions" },
  { id: 6, ticker: "NVDA", name: "NVIDIA Corp.", description: "Semiconductors and AI" },
  { id: 7, ticker: "NFLX", name: "Netflix Inc.", description: "Streaming Services" },
  { id: 8, ticker: "INTC", name: "Intel Corp.", description: "Semiconductors" },
  { id: 9, ticker: "PYPL", name: "PayPal Holdings Inc.", description: "Digital Payments" },
  { id: 10, ticker: "ADBE", name: "Adobe Inc.", description: "Software Industry" },
];

const sp50Companies: Stock[] = [
  { id: 101, ticker: "BRK.B", name: "Berkshire Hathaway Inc.", description: "Conglomerate" },
  { id: 102, ticker: "JNJ", name: "Johnson & Johnson", description: "Pharmaceuticals & Consumer Goods" },
  { id: 103, ticker: "V", name: "Visa Inc.", description: "Financial Services" },
  { id: 104, ticker: "PG", name: "Procter & Gamble Co.", description: "Consumer Products" },
  { id: 105, ticker: "JPM", name: "JPMorgan Chase & Co.", description: "Banking" },
  { id: 106, ticker: "XOM", name: "Exxon Mobil Corp.", description: "Energy" },
  { id: 107, ticker: "INTC", name: "Intel Corp.", description: "Semiconductors" },
  { id: 108, ticker: "CSCO", name: "Cisco Systems Inc.", description: "Networking Hardware" },
  { id: 109, ticker: "KO", name: "Coca-Cola Co.", description: "Beverages" },
  { id: 110, ticker: "MRK", name: "Merck & Co. Inc.", description: "Pharmaceuticals" },
  { id: 111, ticker: "PFE", name: "Pfizer Inc.", description: "Pharmaceuticals" },
  { id: 112, ticker: "DIS", name: "Walt Disney Co.", description: "Entertainment" },
  { id: 113, ticker: "NKE", name: "Nike Inc.", description: "Apparel" },
  { id: 114, ticker: "VZ", name: "Verizon Communications Inc.", description: "Telecommunications" },
  { id: 115, ticker: "T", name: "AT&T Inc.", description: "Telecommunications" },
  { id: 116, ticker: "COST", name: "Costco Wholesale Corp.", description: "Retail" },
  { id: 117, ticker: "HD", name: "Home Depot Inc.", description: "Home Improvement" },
  { id: 118, ticker: "WMT", name: "Walmart Inc.", description: "Retail" },
  { id: 119, ticker: "MCD", name: "McDonald's Corp.", description: "Fast Food" },
  { id: 120, ticker: "MMM", name: "3M Co.", description: "Conglomerate" },
];

const additionalStocks: Stock[] = [
  { id: 201, ticker: "TQQQ", name: "TQQQ", description: "ProShares UltraPro QQQ ETF" },
  { id: 202, ticker: "SPY", name: "SPY", description: "SPDR S&P 500 ETF Trust" },
  { id: 203, ticker: "DIA", name: "DIA", description: "SPDR Dow Jones Industrial Average ETF Trust" },
];

// Create stock bins for foldable lists
const stockBins = [
  { label: "NASDAQ Companies", stocks: nasdaqCompanies },
  { label: "Top 50 S&P 500 Companies", stocks: sp50Companies },
  { label: "Indexes & ETFs", stocks: additionalStocks },
];

const categories: Category[] = [
  { label: "News", icon: <ArticleIcon /> },
  { label: "Data", icon: <AssessmentIcon /> },
  { label: "Reddit", icon: <ForumIcon /> },
  { label: "Twitter", icon: <TwitterIcon /> },
  { label: "DeepAnalyze", icon: <InsightsIcon /> },
  { label: "StreamLit", icon: <BarChartIcon /> },
];

// Custom Material UI theme with dark mode, refined colors, gradient backgrounds and modern typography
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
  shadows: Array(25).fill("none") as any,
});

const StreamLitSection = ({ stock }: { stock: Stock }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStreamLitData = async () => {
      setLoading(true);
      try {
        // Replace the URL below with the actual StreamLit API endpoint.
        const response = await fetch(`https://api.streamlit.io/endpoint?stock=${encodeURIComponent(stock.ticker)}`);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching StreamLit data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStreamLitData();
  }, [stock]);

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        StreamLit Analysis
      </Typography>
      {loading ? (
        <Skeleton variant="rectangular" height={200} />
      ) : data ? (
        <Box>
          <Typography variant="body1">
            StreamLit Data for {stock.name}:
          </Typography>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {data.analysis}
          </Typography>
          {data.chartUrl && (
            <Box sx={{ mt: 2 }}>
              <img
                src={data.chartUrl}
                alt="StreamLit Chart"
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Box>
          )}
        </Box>
      ) : (
        <Typography variant="body1" color="error">
          Unable to load StreamLit data.
        </Typography>
      )}
    </Box>
  );
};

// Modular NewsSection component with enhanced cards and spacing
const NewsSection = ({ stock }: { stock: Stock }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const apiKey = "AIzaSyC_z_SC4KbuU-gV3Mdjp8x9w2hyv_6CGwU";
        if (!apiKey) {
          throw new Error("Google API key is not defined");
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Get 5 news articles about ${stock.name} in the last 3 months. Provide a JSON object with an array field "articles" where each article includes:
        "heading" (the article's title),
        "brief_summary" (a concise summary of the article),
        "sentiment" (either "positive", "negative", or "neutral"),
        "source" (one of "Wall Street Journal", "Financial Times", "New York Times", "Bloomberg").
        Return only a valid JSON object without any warnings or disclaimers.`;

        const result = await model.generateContent(prompt);
        let textResponse = result.response.text().trim();
        textResponse = textResponse.replace(/```json\s*/, "").replace(/```/, "").trim();
        const jsonResult = JSON.parse(textResponse);

        // Dictionary mapping each source to a hyperlink
        const sourceLinks: Record<string, string> = {
          "Wall Street Journal": "https://www.wsj.com",
          "Financial Times": "https://www.ft.com",
          "New York Times": "https://www.nytimes.com",
          "Bloomberg": "https://www.bloomberg.com"
        };

        const newsArticles: NewsArticle[] = jsonResult.articles.map((article: any) => ({
          title: article.heading,
          snippet: article.brief_summary,
          url: sourceLinks[article.source] || "#",
          sentiment: article.sentiment,
          source: article.source,
        }));
        setNews(newsArticles);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [stock]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "success";
      case "negative":
        return "error";
      default:
        return "default";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "👍";
      case "negative":
        return "👎";
      default:
        return "🤷‍♂️";
    }
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        News
      </Typography>
      {loading ? (
        [...Array(5)].map((_, index) => (
          <Card
            key={index}
            elevation={4}
            sx={{
              marginBottom: 2,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ padding: 2 }}>
              <Skeleton variant="text" sx={{ fontSize: '2rem', width: '80%', marginBottom: 1 }} />
              <Skeleton variant="rectangular" height={80} sx={{ marginBottom: 1 }} />
              <Box sx={{ display: 'flex', gap: 2, marginBottom: 1 }}>
                <Skeleton variant="rounded" width={120} height={32} />
                <Skeleton variant="rounded" width={120} height={32} />
              </Box>
              <Skeleton variant="rounded" width={100} height={36} />
            </CardContent>
          </Card>
        ))
      ) : (
        news.map((article, index) => (
          <Card
            key={index}
            elevation={4}
            sx={{
              marginBottom: 2,
              borderRadius: 2,
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
            }}
          >
            <CardContent sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                {article.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {article.snippet}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: "bold", marginRight: 1 }}>
                  Sentiment:
                </Typography>
                <Chip 
                  label={article.sentiment}
                  icon={<span>{getSentimentIcon(article.sentiment)}</span>}
                  color={getSentimentColor(article.sentiment)}
                  sx={{ fontWeight: "bold" }}
                />
              </Box>
              <Typography variant="caption" display="block" sx={{ marginBottom: 1 }}>
                Source: {article.source}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                href={article.url}
                target="_blank"
                size="small"
              >
                Read more
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

const DeepAnalyze = ({ stock }: { stock: Stock }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [recommendation, setRecommendation] = useState<{
    recommendation: string;
    justification: string;
  } | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      setLoading(true);
      try {
        const apiKey = "AIzaSyC_z_SC4KbuU-gV3Mdjp8x9w2hyv_6CGwU";
        if (!apiKey) throw new Error("Gemini API key is not defined");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `What is your overall recommendation for ${stock.name}? Provide a JSON object with the field "recommendation" (which can be "Buy", "Hold", or "Sell") and a field "justification" with a concise explanation. Return only a JSON object without any warnings or disclaimers.`;
        const result = await model.generateContent(prompt);
        let textResponse = result.response.text().trim();
        textResponse = textResponse.replace(/```json\s*/, "").replace(/```/, "").trim();
        const parsed = JSON.parse(textResponse);
        setRecommendation({
          recommendation: parsed.recommendation,
          justification: parsed.justification
        });
      } catch (error) {
        console.error("Error fetching deep analysis:", error);
        setRecommendation(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendation();
  }, [stock]);

  const getRecommendationColor = (recommendation: string) => {
    if (!recommendation) return "default";
    
    switch (recommendation.toLowerCase()) {
      case "buy":
        return "success";
      case "hold":
        return "warning";
      case "sell":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Deep Analyze
      </Typography>
      <Card
        elevation={4}
        sx={{
          marginBottom: 2,
          borderRadius: 2,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
        }}
      >
        <CardContent sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            {stock.name} Deep Analyze
          </Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={100} />
          ) : recommendation ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: "bold", marginRight: 1 }}>
                  Recommendation:
                </Typography>
                <Chip 
                  label={recommendation.recommendation} 
                  color={getRecommendationColor(recommendation.recommendation)}
                  sx={{ fontWeight: "bold" }}
                />
              </Box>
              <Typography variant="body1">
                {recommendation.justification}
              </Typography>
            </>
          ) : (
            <Typography color="error">
              Unable to fetch recommendation. Please try again later.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};


// Dashboard component with Tabs for category selection, smooth transitions and a skeleton loader for data visualizations
const RedditSummary = ({ stock }: { stock: Stock }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<string | React.ReactNode>("Loading Reddit summary...");
  const cacheRef = useRef<Record<number, string | React.ReactNode>>({});

  useEffect(() => {
    if (cacheRef.current[stock.id]) {
      setSummary(cacheRef.current[stock.id]);
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const apiKey = "AIzaSyC_z_SC4KbuU-gV3Mdjp8x9w2hyv_6CGwU";
        if (!apiKey) throw new Error("Gemini API key is not defined");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Summarize a few recent Reddit discussion threads about ${stock.name}. Limit the search to threads from r/wallstreetbets, r/investing, r/stocks, r/stockmarket. Return 5 threads. Provide a JSON object with a field "threads" where each thread includes a "summary", "title", "sentiment", "investment_recommendation", "sentiment_for_display" (which returns only "positive" or "negative"), and "source". Return only json object without warning or disclaimers.`;
        
        const result = await model.generateContent(prompt);
        let textResponse = result.response.text();
        textResponse = textResponse.replace(/```json\s*/, "").replace(/```/, "").trim();
        
        if (textResponse) {
          const jsonResult = JSON.parse(textResponse);
          if (jsonResult.threads && Array.isArray(jsonResult.threads)) {
            const renderedSummary = jsonResult.threads.map((thread: any, index: number) => {
              const sentimentDisplay = thread.sentiment_for_display.toLowerCase();
              const investmentIcon = sentimentDisplay === "positive" ? "👍" : sentimentDisplay === "negative" ? "👎" : "🤷‍♂️";
              
              return (
                <Card
                  key={index}
                  elevation={4}
                  sx={{
                    marginBottom: 2,
                    borderRadius: 2,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                  }}
                >
                  <CardContent sx={{ padding: 2 }}>
                    <Typography variant="h6">{thread.title}</Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                      {thread.summary}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: "bold", marginRight: 1 }}>
                        Sentiment:
                      </Typography>
                      <Chip 
                        label={thread.sentiment} 
                        color={sentimentDisplay === "positive" ? "success" : "error"}
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: "bold", marginRight: 1 }}>
                        Investment Recommendation:
                      </Typography>
                      <Chip 
                        label={thread.investment_recommendation} 
                        icon={<span>{investmentIcon}</span>}
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ display: "block" }}>
                      Source: {thread.source}
                    </Typography>
                  </CardContent>
                </Card>
              );
            });
            setSummary(renderedSummary);
            cacheRef.current[stock.id] = renderedSummary;
          } else {
            throw new Error("Invalid format from Gemini API");
          }
        }
      } catch (error) {
        console.error("Error fetching Reddit summary:", error);
        setSummary("Unable to fetch Reddit summary.");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [stock]);

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Reddit
      </Typography>
      {loading ? (
        [...Array(3)].map((_, index) => (
          <Card
            key={index}
            elevation={4}
            sx={{
              marginBottom: 2,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ padding: 2 }}>
              <Skeleton variant="text" sx={{ fontSize: '2rem', width: '80%', marginBottom: 1 }} />
              <Skeleton variant="rectangular" height={80} sx={{ marginBottom: 1 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rounded" width={120} height={32} />
                <Skeleton variant="rounded" width={120} height={32} />
              </Box>
            </CardContent>
          </Card>
        ))
      ) : typeof summary === "string" ? (
        <Typography variant="body1">{summary}</Typography>
      ) : (
        summary
      )}
    </Box>
  );
};

const TwitterSummary = ({ stock }: { stock: Stock }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tweets, setTweets] = useState<string | React.ReactNode>("Loading tweets...");
  const cacheRef = useRef<Record<number, string | React.ReactNode>>({});

  useEffect(() => {
    if (cacheRef.current[stock.id]) {
      setTweets(cacheRef.current[stock.id]);
      setLoading(false);
      return;
    }

    const fetchTweets = async () => {
      setLoading(true);
      try {
        const apiKey = "AIzaSyC_z_SC4KbuU-gV3Mdjp8x9w2hyv_6CGwU";
        if (!apiKey) throw new Error("Gemini API key is not defined");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Generate 5 imaginary tweets about ${stock.name} reflecting recent market sentiment from fictional twitter accounts. Provide a JSON object with a field "tweets" which is an array, where each tweet includes "tweet", "user", "sentiment"(non numerical), and "sentiment_for_display" (which returns only "positive" or "negative"). Return only json object without any warnings or disclaimers.`;
        
        const result = await model.generateContent(prompt);
        let textResponse = result.response.text();
        textResponse = textResponse.replace(/```json\s*/, "").replace(/```/, "").trim();
        
        if (textResponse) {
          const jsonResult = JSON.parse(textResponse);
          if (jsonResult.tweets && Array.isArray(jsonResult.tweets)) {
            const renderedTweets = jsonResult.tweets.map((tweetObj: any, index: number) => {
              const sentimentDisplay = tweetObj.sentiment_for_display.toLowerCase();
              const sentimentIcon = sentimentDisplay === "positive" ? "👍" : sentimentDisplay === "negative" ? "👎" : "🤷‍♂️";
              
              return (
                <Card
                  key={index}
                  elevation={4}
                  sx={{
                    marginBottom: 2,
                    borderRadius: 2,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                  }}
                >
                  <CardContent sx={{ padding: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {tweetObj.user.startsWith('@') ? tweetObj.user : `@${tweetObj.user}`}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                      {tweetObj.tweet}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="caption" sx={{ fontWeight: "bold", marginRight: 1 }}>
                        Sentiment:
                      </Typography>
                      <Chip 
                        label={tweetObj.sentiment}
                        icon={<span>{sentimentIcon}</span>}
                        color={sentimentDisplay === "positive" ? "success" : "error"}
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              );
            });
            setTweets(renderedTweets);
            cacheRef.current[stock.id] = renderedTweets;
          } else {
            throw new Error("Invalid format from Gemini API for tweets");
          }
        }
      } catch (error) {
        console.error("Error fetching tweets:", error);
        setTweets("Unable to fetch tweets.");
      } finally {
        setLoading(false);
      }
    };
    fetchTweets();
  }, [stock]);

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Twitter
      </Typography>
      {loading ? (
        [...Array(5)].map((_, index) => (
          <Card
            key={index}
            elevation={4}
            sx={{
              marginBottom: 2,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ padding: 2 }}>
              <Skeleton variant="text" width={150} sx={{ marginBottom: 1 }} />
              <Skeleton variant="rectangular" height={60} sx={{ marginBottom: 1 }} />
              <Skeleton variant="rounded" width={100} height={32} />
            </CardContent>
          </Card>
        ))
      ) : typeof tweets === "string" ? (
        <Typography variant="body1">{tweets}</Typography>
      ) : (
        tweets
      )}
    </Box>
  );
};

const Dashboard = ({ stock }: { stock: Stock }) => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [chartLoaded, setChartLoaded] = useState<boolean>(false);
  return (
    <Box sx={{ padding: 2 }}>
      <Tabs
        value={selectedCategory}
        onChange={(event, newValue) => setSelectedCategory(newValue)}
        textColor="primary"
        indicatorColor="secondary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ marginBottom: 2, transition: "all 0.3s" }}
      >
        {categories.map((category, index) => (
          <Tab
            key={index}
            label={category.label}
            icon={category.icon}
            sx={{ textTransform: "none", fontWeight: selectedCategory === index ? "bold" : "normal" }}
          />
        ))}
      </Tabs>
      <Typography variant="h5" gutterBottom sx={{ transition: "all 0.3s" }}>
        {stock.name} - {categories[selectedCategory].label}
      </Typography>
      {categories[selectedCategory].label === "News" && <NewsSection stock={stock} />}
      {categories[selectedCategory].label === "Data" && (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 2 }}>
    <Box sx={{ position: "relative", width: 800, height: 420, marginBottom: 3 }}>
      {!chartLoaded && <Skeleton variant="rectangular" width={800} height={420} animation="wave" />}
      <iframe
        frameBorder="0"
        scrolling="no"
        width="800"
        height="420"
        src={`https://api.stockdio.com/visualization/financial/charts/v1/HistoricalPrices?app-key=ADB47D3055FB4821A172EDF7F6E737C9&symbol=${stock.ticker}&dividends=true&splits=true&palette=Financial-Light`}
        title="Financial Chart"
        onLoad={() => setChartLoaded(true)}
        style={{ display: chartLoaded ? "block" : "none", borderRadius: 8 }}
      ></iframe>
    </Box>
    <Box sx={{ position: "relative", width: 800, height: 420 }}>
      {!chartLoaded && <Skeleton variant="rectangular" width={800} height={420} animation="wave" />}
      <iframe
        frameBorder="0"
        scrolling="no"
        width="800"
        height="420"
        src={`https://api.stockdio.com/visualization/financial/charts/v1/PricesChange?app-key=ADB47D3055FB4821A172EDF7F6E737C9&symbol=${stock.ticker}&palette=Financial-Light&showLogo=Title`}
        title="Price Change Chart"
        onLoad={() => setChartLoaded(true)}
        style={{ display: chartLoaded ? "block" : "none", borderRadius: 8 }}
      ></iframe>
    </Box>
  </Box>
)}
      {categories[selectedCategory].label === "Reddit" && <RedditSummary stock={stock} />}
      {categories[selectedCategory].label === "Twitter" && <TwitterSummary stock={stock} />}
      {categories[selectedCategory].label === "DeepAnalyze" && <DeepAnalyze stock={stock} />}
      {categories[selectedCategory].label === "StreamLit" && <StreamLitSection stock={stock} />}
    </Box>
  );
};

const App = () => {
  const [selectedStock, setSelectedStock] = useState<Stock>(nasdaqCompanies[0]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerContent = (
    <Box sx={{ width: 250, backgroundColor: theme.palette.background.paper, height: "100%" }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        Stocks
      </Typography>
      <Divider />
      {stockBins.map((bin, binIndex) => (
        <Accordion key={binIndex} defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{bin.label}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {bin.stocks.map((stock) => (
              <ListItemButton
                key={stock.id}
                onClick={() => {
                  setSelectedStock(stock);
                  setDrawerOpen(false);
                }}
                sx={{ paddingY: 0.5 }}
              >
                <ListItemText primary={stock.name} secondary={stock.ticker} />
              </ListItemButton>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: "100vh", background: "linear-gradient(135deg, #121212 30%, #1e1e1e 90%)" }}>
        <AppBar
          position="static"
          sx={{
            background: "linear-gradient(45deg, #90caf9, #f48fb1)",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Ask BillionaireBot!"
              fullWidth
              sx={{ 
                backgroundColor: "white", 
                borderRadius: 1,
                '& .MuiInputBase-input': {
                  color: 'black',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Toolbar>
        </AppBar>
        <Drawer open={drawerOpen} onClose={toggleDrawer}>
          {drawerContent}
        </Drawer>
        <Grid container sx={{ height: "calc(100vh - 64px)" }}>
          <Grid item sx={{ width: 250, display: { xs: "none", md: "block" } }}>
            {drawerContent}
          </Grid>
          <Grid item xs>
            <Dashboard stock={selectedStock} />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default App;