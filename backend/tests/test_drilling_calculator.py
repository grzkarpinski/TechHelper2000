import pytest

from backend.calculations.drilling_feed_speed import calculate_drilling


def test_calculate_drilling_from_vc_and_fn() -> None:
    result = calculate_drilling({"vc": 90.0, "n": None, "fn": 0.25, "f": None, "d": 12.0})

    assert result["vc"] == pytest.approx(90.0, abs=0.01)
    assert result["n"] == pytest.approx(2387.3241, abs=0.01)
    assert result["f"] == pytest.approx(596.831, abs=0.01)
    assert result["fn"] == pytest.approx(0.25, abs=0.001)


def test_calculate_drilling_from_n_and_f() -> None:
    result = calculate_drilling({"vc": None, "n": 2000.0, "fn": None, "f": 300.0, "d": 10.0})

    assert result["vc"] == pytest.approx(62.8319, abs=0.01)
    assert result["fn"] == pytest.approx(0.15, abs=0.001)


def test_calculate_drilling_rejects_both_fn_and_f() -> None:
    with pytest.raises(ValueError, match="fn lub f"):
        calculate_drilling({"vc": 80.0, "n": None, "fn": 0.2, "f": 500.0, "d": 10.0})


def test_calculate_drilling_requires_speed_input() -> None:
    with pytest.raises(ValueError, match="vc lub n"):
        calculate_drilling({"vc": None, "n": None, "fn": 0.2, "f": None, "d": 10.0})
