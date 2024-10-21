class BookMarks {
  #bookmarks;

  constructor() {
    this.#bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
  }

  contains(id) {
    return Boolean(this.#bookmarks[id]);
  }

  add(target) {
    this.#bookmarks[target.id] = target;
    try {
      localStorage.setItem('bookmarks', JSON.stringify(this.#bookmarks));
    } catch {
      alert('더 이상 추가할 수 없습니다.');
      delete this.#bookmarks[id];
    }
  }

  delete(id) {
    delete this.#bookmarks[id];
    localStorage.setItem('bookmarks', JSON.stringify(this.#bookmarks));
  }

  getContents() {
    return { ...this.#bookmarks };
  }
}

const bookmarks = new BookMarks();

export { bookmarks };
