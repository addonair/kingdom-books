import { useBrand } from '../context/BrandContext.jsx'
import SimpleMarkdown from '../components/SimpleMarkdown.jsx'

function TermsPage() {
  const brand = useBrand()
  return (
    <div className="bg-brand-page min-h-[calc(100vh-64px)] py-8 md:py-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-brand-line p-6 md:p-10">
        <SimpleMarkdown source={brand.termsContent} />
      </div>
    </div>
  )
}

export default TermsPage
