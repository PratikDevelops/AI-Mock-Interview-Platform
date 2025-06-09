import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import FeaturesSection from '../Components/FeaturesSection'
import HowItWorksSection from '../Components/HowItWorksSection'
import BookInterviewSection from '../Components/BookInterviewSection'
import PricingSection from '../Components/PricingSection'
import FaqSection from '../Components/FaqSection'
import Footer from '../Components/Footer'
import ContactUs from '../Components/ContactUs'

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <BookInterviewSection />
      <HowItWorksSection />
      
      <PricingSection />
      <FaqSection />
      <ContactUs/>
      <Footer />
    </div>
  )
}

export default HomePage
