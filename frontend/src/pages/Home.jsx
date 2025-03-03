import CategorySection from "./components/CategorySection";
import SlideShow from "./components/SlideShow";
import AuthorSection from "./components/AuthorSection";
// import BookCarousel from "./components/BookCarousel";
import RecommandSection from "./components/RecommandSection";
import FooterSection from "./components/FooterSection";


export default function Home() {
  

  return (
    <div>
        {/* slide show section  */}
        <SlideShow />

        {/* recommanded book section  */}
        {/* <BookCarousel/> */}
        <RecommandSection />

        {/* categories section  */}
        <CategorySection/>

        {/* author section  */}
        <AuthorSection />

        {/* footer section  */}
        <FooterSection />
    </div>
  )
}
