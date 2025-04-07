import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [countData, setCountData] = useState({
    users: 0,
    trades: 0,
    volume: 0,
    return: 0
  });

  // Track scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animate counters
  useEffect(() => {
    const targetData = {
      users: 12500,
      trades: 483000,
      volume: 72,
      return: 32
    };

    const incrementAmount = {
      users: 100,
      trades: 2500,
      volume: 1,
      return: 0.5
    };

    const timer = setInterval(() => {
      setCountData(prev => {
        // Create a new object to store updated values
        const newData = { ...prev };
        let allComplete = true;

        // Update each counter
        for (const key in prev) {
          if (prev[key] < targetData[key]) {
            newData[key] = Math.min(prev[key] + incrementAmount[key], targetData[key]);
            allComplete = false;
          }
        }

        // If all counters have reached their targets, stop the timer
        if (allComplete) {
          clearInterval(timer);
        }

        return newData;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Testimonial data
  const testimonials = [
    {
      text: "Asphire Trading transformed how I manage my investments. The intuitive interface and real-time market data have given me confidence in every trade.",
      author: "Sophia Chen",
      title: "Retail Investor"
    },
    {
      text: "As someone new to trading, I needed a platform that was easy to understand but still powerful. Asphire delivers on both fronts - I've learned so much while growing my portfolio.",
      author: "Marcus Johnson",
      title: "Beginning Trader"
    },
    {
      text: "The technical analysis tools in Asphire Trading are top-notch. I can quickly identify patterns and make decisions based on solid data. My returns have increased by 24% since switching.",
      author: "Alicia Martinez",
      title: "Day Trader"
    }
  ];

  const features = [
    {
      icon: "📊",
      title: "Advanced Charts",
      description: "Powerful charting tools with multiple technical indicators and timeframes"
    },
    {
      icon: "🔔",
      title: "Real-time Alerts",
      description: "Set custom price alerts and get notified instantly when conditions are met"
    },
    {
      icon: "📱",
      title: "Mobile Trading",
      description: "Trade on the go with our responsive platform that works on any device"
    },
    {
      icon: "🛡️",
      title: "Secure Platform",
      description: "Bank-level security with 2FA and encryption to keep your assets safe"
    },
    {
      icon: "📈",
      title: "Portfolio Analysis",
      description: "Detailed insights on performance, risk metrics, and diversification"
    },
    {
      icon: "🤖",
      title: "Trading Automation",
      description: "Create custom strategies and automate your trading with ease"
    }
  ];

  // Pricing plans
  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Real-time market data",
        "Basic charting tools",
        "Up to 3 watchlists",
        "Market news feed",
        "Paper trading account"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      features: [
        "Everything in Basic",
        "Advanced technical indicators",
        "Unlimited watchlists",
        "Price alerts",
        "Portfolio analysis",
        "Trading automation (basic)"
      ],
      cta: "Try 14 Days Free",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "/month",
      features: [
        "Everything in Pro",
        "API access",
        "Advanced trading automation",
        "Multi-account management",
        "Premium data feeds",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="landing-container">
      {/* Header */}
      <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <h2>Asphire Trading</h2>
        </div>
        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
        </nav>
        <div className="header-buttons">
          <Link to="/login" className="btn-secondary">Log In</Link>
          <Link to="/signup" className="btn-primary">Sign Up Free</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Trade Smarter, Not Harder</h1>
          <p>The advanced trading platform with everything you need to analyze, execute, and optimize your trades</p>

          <div className="hero-cta">
            <Link to="/signup" className="btn-hero-primary">Get Started Free</Link>
            <Link to="/demo" className="btn-hero-secondary">Watch Demo</Link>
          </div>

          <div className="trust-badges">
            <div className="badge">
              <span className="icon">🔒</span>
              <span className="text">Bank-level Security</span>
            </div>
            <div className="badge">
              <span className="icon">⚡</span>
              <span className="text">Real-time Data</span>
            </div>
            <div className="badge">
              <span className="icon">🔄</span>
              <span className="text">Instant Execution</span>
            </div>
          </div>
        </div>
        <div className="hero-image-container">
          <img src="/api/placeholder/700/500" alt="Asphire Trading Platform Dashboard" className="hero-image" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-item">
          <h3>{countData.users.toLocaleString()}+</h3>
          <p>Active Traders</p>
        </div>
        <div className="stat-item">
          <h3>{countData.trades.toLocaleString()}+</h3>
          <p>Trades Executed</p>
        </div>
        <div className="stat-item">
          <h3>${countData.volume}M+</h3>
          <p>Monthly Volume</p>
        </div>
        <div className="stat-item">
          <h3>{countData.return}%</h3>
          <p>Avg. User Return</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Powerful Trading Features</h2>
          <p>Everything you need to succeed in today's dynamic markets</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-header">
          <h2>How Asphire Trading Works</h2>
          <p>Start trading in three simple steps</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Your Account</h3>
            <p>Sign up for free in less than 2 minutes with just your email</p>
          </div>
          <div className="step-divider"></div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Set Up Your Portfolio</h3>
            <p>Connect your brokerage or start with a paper trading account</p>
          </div>
          <div className="step-divider"></div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Start Trading</h3>
            <p>Use our powerful tools to analyze the market and execute trades</p>
          </div>
        </div>

        <div className="platform-preview">
          <img src="/api/placeholder/1000/600" alt="Asphire Trading Platform" className="platform-image" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p>Join thousands of satisfied traders using Asphire Trading</p>
        </div>

        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">"</div>
              <p>{testimonials[currentTestimonial].text}</p>
            </div>
            <div className="testimonial-author">
              <div className="author-image-placeholder"></div>
              <div className="author-info">
                <h4>{testimonials[currentTestimonial].author}</h4>
                <p>{testimonials[currentTestimonial].title}</p>
              </div>
            </div>
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section" id="pricing">
        <div className="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your trading style</p>
        </div>

        <div className="pricing-container">
          {plans.map((plan, index) => (
            <div className={`pricing-card ${plan.popular ? 'popular' : ''}`} key={index}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="amount">{plan.price}</span>
                {plan.period && <span className="period">{plan.period}</span>}
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button className={`plan-cta ${plan.popular ? 'cta-primary' : 'cta-secondary'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Trading?</h2>
          <p>Join thousands of successful traders who have already discovered Asphire Trading</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-cta-primary">Get Started Free</Link>
            <Link to="/contact" className="btn-cta-secondary">Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-column">
            <h3>Asphire Trading</h3>
            <p>Advanced trading platform for modern investors</p>
            <div className="social-icons">
              <a href="#" className="social-icon">𝕏</a>
              <a href="#" className="social-icon">f</a>
              <a href="#" className="social-icon">in</a>
              <a href="#" className="social-icon">ig</a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Roadmap</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API</a></li>
              <li><a href="#">Community</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Asphire Trading. All rights reserved.</p>
          <p>Trading involves risk. Not investment advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;