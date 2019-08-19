for a in b do end
for a in b do local a local b end
for a in b do local a; local b; end
for a, b, c in p do end
for a, b, c in p, q, r do end
for a in 1 do end
for a in true do end
for a in "foo" do end
for a in b do break end
for a in b do return end
for a in b do do end end
for a in b do do break end end
for a in b do do return end end
for a = p, q do end
for a = 1, 2 do end
for a = 1, 2 do local a local b end
for a = 1, 2 do local a; local b; end
for a = p, q, r do end
for a = 1, 2, 3 do end
for a = p, q do break end
for a = 1, 2 do return end
for a = p, q do do end end
for a = p, q do do break end end
for a = p, q do do return end end
