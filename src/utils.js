import nlp from 'compromise';

// Includes whitespace before characters in sentence.
export function sentenceTokenize(text) {
  const sentences = nlp(text)
    .json({ offset: true, whitespace: true })
    .map((s) => ({ size: s.offset, text: s.text }));

  if (sentences.length !== 0) {
    sentences[0].size.length =
      sentences[0].size.start + sentences[0].size.length;
    sentences[0].size.start = 0;
    if (sentences.length !== 1) {
      for (let i = 1; i < sentences.length;) {
        const prev = sentences[i - 1];
        sentences[i].size.length += sentences[i].size.start
          - (prev.size.length + prev.size.start);
        sentences[i].size.start = prev.size.start + prev.size.length;
        i += 1;
      }
    }
    return sentences;
  }
  return [];
}

export function getSentenceForCaret(text, cursor) {
  // Get length of sentences with whitespace included
  const sentences = sentenceTokenize(text);

  let start = 0;
  let end = 0;

  for (let i = 0; i < sentences.length;) {
    end += sentences[i].size.length;
    if (cursor <= end) {
      return { start, end };
    }
    if (cursor > end && i === sentences.length - 1) {
      return { start, end };
    }
    start = end;
    i += 1;
  }

  return { start, end };
}

export function getSentencesForSelect(
  text,
  selectStart,
  selectEnd
) {
  // Get length of sentences with whitespace included
  const sentences = sentenceTokenize(text);

  let start = 0;
  let end = 0;

  let foundStart = false;

  for (let i = 0; i < sentences.length;) {
    const { start: sentenceStart, length } = sentences[i];
    end += length;
    if (!foundStart) {
      if (sentenceStart <= selectStart && selectStart <= end) {
        foundStart = true;
        start = sentenceStart;
      }
    } else if (sentenceStart <= selectEnd && selectEnd <= end) {
      return { start, end };
    }
    i += 1;
  }

  return { start, end };
}

export function getDateNowKey() {
  const date = new Date();
  return date.toDateString();
}

export function createEntry(content) {
  const date = new Date();
  const [month, day, year] = [
    date.getMonth(),
    date.getDate(),
    date.getFullYear(),
  ];
  const [hour, minutes, seconds] = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];

  const entryObj = {
    key: date.toDateString(),
    date: {
      year,
      month,
      day,
    },
    lastEdited: {
      hour,
      minutes,
      seconds,
    },
    content,
  };

  return entryObj;
}
