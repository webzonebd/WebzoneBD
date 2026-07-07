import { useEffect } from 'react';

interface HelmetProps {
  title: string;
  description?: string;
  language?: string;
}

export default function Helmet({ title, description, language }: HelmetProps) {
  useEffect(() => {
    // Update Document Title
    const originalTitle = document.title;
    document.title = title;

    // Setup and Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    let createdDescription = false;
    if (description) {
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
        createdDescription = true;
      }
      metaDescription.setAttribute('content', description);
    }

    // Setup and Update Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    let createdOgTitle = false;
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
      createdOgTitle = true;
    }
    ogTitle.setAttribute('content', title);

    // Setup and Update Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    let createdOgDesc = false;
    if (description) {
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
        createdOgDesc = true;
      }
      ogDesc.setAttribute('content', description);
    }

    // Sync HTML Language tag
    const htmlTag = document.documentElement;
    const previousLang = htmlTag.getAttribute('lang');
    if (language) {
      htmlTag.setAttribute('lang', language);
    }

    // Cleanup logic to revert changes if the component unmounts
    return () => {
      document.title = originalTitle;
      if (previousLang) {
        htmlTag.setAttribute('lang', previousLang);
      }
      if (createdDescription && metaDescription && metaDescription.parentNode) {
        metaDescription.parentNode.removeChild(metaDescription);
      }
      if (createdOgTitle && ogTitle && ogTitle.parentNode) {
        ogTitle.parentNode.removeChild(ogTitle);
      }
      if (createdOgDesc && ogDesc && ogDesc.parentNode) {
        ogDesc.parentNode.removeChild(ogDesc);
      }
    };
  }, [title, description, language]);

  return null;
}
