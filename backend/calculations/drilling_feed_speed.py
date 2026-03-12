import math


def calculate_drilling(data: dict[str, float | None]) -> dict[str, float]:
    vc = data.get("vc")
    n = data.get("n")
    fn = data.get("fn")
    f = data.get("f")
    d = data.get("d")

    if d is None:
        raise ValueError("Wymagane pole: d")
    if vc is not None and n is not None:
        raise ValueError("Podaj tylko jedno z pol: vc lub n")
    if vc is None and n is None:
        raise ValueError("Wymagane jest jedno z pol: vc lub n")

    if fn is not None and f is not None:
        raise ValueError("Podaj tylko jedno z pol: fn lub f")
    if fn is None and f is None:
        raise ValueError("Wymagane jest jedno z pol: fn lub f")

    n_value = float(n) if n is not None else (1000 * float(vc)) / (math.pi * float(d))
    f_value = float(f) if f is not None else float(fn) * n_value

    vc_value = (math.pi * float(d) * n_value) / 1000
    fn_value = f_value / n_value

    return {
        "vc": round(vc_value, 4),
        "n": round(n_value, 4),
        "fn": round(fn_value, 4),
        "f": round(f_value, 4),
    }
