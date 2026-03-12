import pytest

from backend.calculations.milling_feed_speed import calculate_milling


def test_calculate_milling_from_vc_and_fz() -> None:
    result = calculate_milling({"vc": 100.0, "n": None, "fz": 0.2, "f": None, "d": 50.0, "z": 4})

    assert result["vc"] == pytest.approx(100.0, abs=0.01)
    assert result["n"] == pytest.approx(636.6198, abs=0.01)
    assert result["f"] == pytest.approx(509.2958, abs=0.01)
    assert result["fz"] == pytest.approx(0.2, abs=0.001)


def test_calculate_milling_optional_q() -> None:
    result = calculate_milling(
        {"vc": 100.0, "n": None, "fz": 0.2, "f": None, "d": 50.0, "z": 4, "ap": 2.0, "ae": 3.0}
    )

    assert result["q"] == pytest.approx(3.0558, abs=0.01)


def test_calculate_milling_rejects_both_vc_and_n() -> None:
    with pytest.raises(ValueError, match="vc lub n"):
        calculate_milling({"vc": 100.0, "n": 500.0, "fz": 0.1, "f": None, "d": 20.0, "z": 2})


def test_calculate_milling_requires_feed_input() -> None:
    with pytest.raises(ValueError, match="fz lub f"):
        calculate_milling({"vc": 80.0, "n": None, "fz": None, "f": None, "d": 10.0, "z": 3})
