import math


def calculate_milling(data: dict[str, float | int | None]) -> dict[str, float | None]:
    vc = data.get("vc")
    n = data.get("n")
    fz = data.get("fz")
    f = data.get("f")
    d = data.get("d")
    z = data.get("z")
    ap = data.get("ap")
    ae = data.get("ae")

    if d is None or z is None:
        raise ValueError("Wymagane pola: d oraz z")
    if vc is not None and n is not None:
        raise ValueError("Podaj tylko jedno z pol: vc lub n")
    if vc is None and n is None:
        raise ValueError("Wymagane jest jedno z pol: vc lub n")

    if fz is not None and f is not None:
        raise ValueError("Podaj tylko jedno z pol: fz lub f")
    if fz is None and f is None:
        raise ValueError("Wymagane jest jedno z pol: fz lub f")

    n_value = float(n) if n is not None else (1000 * float(vc)) / (math.pi * float(d))
    f_value = float(f) if f is not None else float(fz) * int(z) * n_value

    vc_value = (math.pi * float(d) * n_value) / 1000
    fz_value = f_value / (int(z) * n_value)

    q_value = None
    if ap is not None and ae is not None:
        q_value = (float(ap) * float(ae) * f_value) / 1000

    return {
        "vc": round(vc_value, 4),
        "n": round(n_value, 4),
        "fz": round(fz_value, 4),
        "f": round(f_value, 4),
        "q": round(q_value, 4) if q_value is not None else None,
    }
