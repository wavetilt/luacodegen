function a() end
function a(p) end
function a(p,q,r) end
function a(p) return end
function a(p) do end end
function a.b() end
function a.b.c.d() end
function a:b() end
function a.b.c:d() end
function a(...) end
function a(p,...) end
function a(p,q,r,...) end
function a() local a local b end
function a() local a; local b; end
function a() end; function a() end;
