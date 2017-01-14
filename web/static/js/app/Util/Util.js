import React from 'react';
import { findDOMNode } from 'react-dom';

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

export function insertAtOffset(target, arr, offset) {
  const newArr = Object.assign([], target);
  for (let i = 0; i < arr.length; i++) {
    newArr[offset + i] = arr[i];
  }
  return newArr;
}

export const getScrollParent = (node) => {
  let el = findDOMNode(node);
  while (el = el.parentElement) {
    switch (window.getComputedStyle(el).overflowY) {
      case 'auto': case 'scroll': case 'overlay': return el;
    }
  }
  return window;
};
