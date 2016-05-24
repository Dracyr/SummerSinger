import React from 'react';

export const PlaceholderText = () => {
  const style = {
    width: '50%',
    height: '1em',
    display: 'inline-block',
    backgroundColor: '#ddd',
  };
  return <div style={style}></div>;
};

export const isParent = (source, target) => {
  let parent = null;
  let searchElement = source;
  while (searchElement !== null) {
    parent = searchElement.parentElement;
    if (parent !== null && parent === target) {
      return true;
    }
    searchElement = parent;
  }

  return false;
};

export const closestSelector = (el, selector) => {
  let matchesFn;

  // find vendor prefix
  [
    'matches',
    'webkitMatchesSelector',
    'mozMatchesSelector',
    'msMatchesSelector',
    'oMatchesSelector',
  ].some((fn) => {
    if (typeof document.body[fn] === 'function') {
      matchesFn = fn;
      return true;
    }
    return false;
  });

  // traverse parents
  let parent = null;
  let searchElement = el;
  while (searchElement !== null) {
    parent = searchElement.parentElement;
    if (parent !== null && parent[matchesFn](selector)) {
      return parent;
    }
    searchElement = parent;
  }

  return null;
};
