let reader = "foo".chars();
assert(reader.hasRemaining);
assert.equal(reader.seq(5), "foo");
assert.equal(reader.seq(1), "f");
assert.equal(reader.peekOrZero(), "f".codePointAt(0));
for (let i = 0; i < 3; i++) {
    reader.next();
}
assert.equal(reader.peekOrZero(), 0x00);
assert(reader.reachedEnd);

assert.equal(2, "\u{10FFFF}\u{10FFFF}".chars().length());