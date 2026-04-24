import HeroBanner from '@/components/home/HeroBanner'
import CategoryGrid from '@/components/home/CategoryGrid'
import FlashSales from '@/components/home/FlashSales'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import TrendingSection from '@/components/home/TrendingSection'
import SocialCommerce from '@/components/home/SocialCommerce'
import RecentlyViewed from '@/components/home/RecentlyViewed'
import WhatsAppCTA from '@/components/home/WhatsAppCTA'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <FlashSales />
      <FeaturedProducts />
      <TrendingSection />
      <SocialCommerce />
      <RecentlyViewed />
      <WhatsAppCTA />
    </>
  )
}
