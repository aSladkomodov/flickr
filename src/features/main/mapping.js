import mapping from "../../utils/mapping";
import DOMPurify from "dompurify";

const resItems = {
  mapping: {
    author: "author",
    description: "description",
    link: "link",
    "media.m": "media",
    tags: "tags",
    title: "title",
    date_taken: "date",
  },
  callback: (configKeyFrom, valueFrom) => {
    switch (configKeyFrom) {
      case "description": {
        // ToDo deleted unsafe html and clean description before mount
        const cleanDescription = DOMPurify.sanitize(
          valueFrom.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "")
        );
        return cleanDescription.length > 150
          ? `${cleanDescription.slice(0, 150)}...`
          : "This item doesn't have description";
      }
      case "tags":
        return valueFrom.length
          ? valueFrom.replace(/\s/gi, ", ").slice(0, 150)
          : "This item doesn't have tags";
      case "date_taken":
        return new Date(valueFrom).toLocaleDateString();
      default: {
        return valueFrom;
      }
    }
  },
};

export const mappingItems = (items = []) =>
  items.map((item, index) => ({
    ...mapping(resItems, item),
    id: item["author_id"] + index,
  }));
