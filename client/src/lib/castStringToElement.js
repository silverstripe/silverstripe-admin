import React from 'react';

/**
 * Searches the given string and highlights/marks instances of needle found
 * with the given tag
 *
 * @param {string} haystack
 * @param {string} needle
 * @param {React|string} Tag
 * @return {Array}
 */
export function mapHighlight(haystack, needle, Tag) {
  let index = 0;
  let search = haystack;
  const results = [];
  const part = needle.toLocaleLowerCase();

  while (index !== -1) {
    index = search.toLocaleLowerCase().indexOf(part);

    if (index !== -1) {
      const next = index + needle.length;
      const start = search.substring(0, index);
      const found = search.substring(index, next);
      const end = search.substring(next);

      if (start.length) {
        results.push(start);
      }
      results.push((Tag) ? <Tag key={results.length / 2}>{found}</Tag> : found);
      search = end;
    }
  }
  results.push(search);

  return results;
}

/**
 * Safely cast string to container element. Supports custom HTML values.
 *
 * See DBField::getSchemaValue()
 *
 * @param {String|Component} Container Container type
 * @param {*} value Form schema value
 * @param {object} props container props
 */
export default function castStringToElement(Container, value, props = {}) {
  if (value && typeof value.react !== 'undefined') {
    return <Container {...props}>{value.react}</Container>;
  }

  // HTML value
  if (value && typeof value.html !== 'undefined') {
    if (value.html !== null) {
      const html = { __html: value.html };
      return <Container {...props} dangerouslySetInnerHTML={html} />;
    }
    return null;
  }

  // Plain value
  let body = null;
  if (value && typeof value.text !== 'undefined') {
    body = value.text;
  } else {
    body = value;
  }

  if (body && typeof body === 'object') {
    throw new Error(`Unsupported string value ${JSON.stringify(body)}`);
  }

  if (body !== null && typeof body !== 'undefined') {
    return <Container {...props}>{body}</Container>;
  }
  return null;
}
