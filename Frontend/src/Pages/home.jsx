
import HeroSection from '../components/sections/hero'
import CategoriesAndServices from '../components/sections/categories'
import HowItWorks from '../components/sections/howitworks'
import Testimonials from '../components/sections/testimonicals'

import AboutSection from '../components/sections/about'

import VendorLandingSection from '../components/sections/pricing'
import CtaSection from './ctaSection'



export default function Home() {
    return (
        <>


            <HeroSection></HeroSection>
            <AboutSection></AboutSection>

            <CategoriesAndServices></CategoriesAndServices>
            <VendorLandingSection />
            <HowItWorks></HowItWorks>

            <Testimonials></Testimonials>
            <CtaSection></CtaSection>

        </>
    )
}
