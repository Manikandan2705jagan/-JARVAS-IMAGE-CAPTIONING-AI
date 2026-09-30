"""Coarse scene inference from real model predictions.

The scene label is a *derived* field, not a model output: the captioner only
produces text, so we bucket the ImageNet predictions into a small set of
human-readable scene categories. This module is intentionally transparent
about that - it is a documented lookup table, not a learned classifier.
"""

from __future__ import annotations

# Keyword -> scene buckets. Keys are matched as substrings against the lowercased
# ImageNet label (and, as a secondary signal, the generated caption).
_SCENE_KEYWORDS: dict[str, tuple[str, ...]] = {
    "Indoor / Home Interior": (
        "couch", "sofa", "chair", "desk", "table lamp", "wardrobe", "bed",
        "dining table", "television", "monitor", "keyboard", "mouse", "bookcase",
        "bookcase", "shower curtain", "pillow", "blanket", "curtain", "lamp",
    ),
    "Kitchen / Dining": (
        "cup", "bowl", "plate", "spoon", "fork", "knife", "espresso maker",
        "coffee mug", "dining table", "rotisserie", "frying pan", "kettle",
        "wok", "mixing bowl", "teapot", "tray", "bottle",
    ),
    "Street / Urban": (
        "street sign", "traffic light", "stop sign", "parking meter", "mailbox",
        "fire hydrant", "zebra", "crosswalk", "streetcar", "trolley", "minivan",
        "beach wagon", "cab", "jeep", "limousine", "bus", "traffic",
    ),
    "Vehicle / Transport": (
        "car", "truck", "motorcycle", "bicycle", "train", "locomotive", "airliner",
        "aircraft carrier", "space shuttle", "helicopter", "schooner", "canoe",
        "catamaran", "container ship", "tank", "ambulance", "minibus",
    ),
    "Animal / Wildlife": (
        "dog", "cat", "bird", "horse", "sheep", "cow", "elephant", "bear",
        "zebra", "giraffe", "tiger", "lion", "monkey", "fox", "wolf", "deer",
        "rabbit", "squirrel", "butterfly", "bee", "spider", "snake", "turtle",
    ),
    "Food / Drink": (
        "pizza", "cheeseburger", "hotdog", "french loaf", "carbonara", "burrito",
        "red wine", "espresso", "cup", "ice cream", "banana", "orange", "strawberry",
        "pineapple", "broccoli", "cauliflower", "zucchini", "mushroom", "pomegranate",
        "guacamole", "pretzel", "trifle", "chocolate sauce", "dough", "corn",
    ),
    "Sports / Recreation": (
        "racket", "tennis ball", "soccer ball", "volleyball", "baseball",
        "skis", "snowboard", "surfboard", "skateboard", "bicycle-built-for-two",
        "golf ball", "baseball player", "soccer player", "ski", "horizontal bar",
        "parallel bars", "balance beam",
    ),
    "Nature / Landscape": (
        "meadow", "alp", "valley", "lakeside", "seashore", "cliff", "gorge",
        "mountain", "mountain tent", "lighthouse", "pier", "raft", "volcano",
        "corn field", "wheat field", "vineyard", "orchard", "forest", "tree",
        "river", "waterfall", "beach", "dune", "icicle",
    ),
}

# Ordered fallback so a single unknown label still yields something sensible.
_DEFAULT_SCENE = "Indoor / General"


def infer_scene(labels: list[str], caption: str = "") -> str | None:
    """Bucket predicted labels (and the caption) into a coarse scene name.

    Args:
        labels: ImageNet label strings from the classifier, highest first.
        caption: Generated caption, used only as a secondary signal.

    Returns:
        A scene name, or ``None`` when there is nothing to go on.
    """
    haystacks = [label.lower() for label in labels]
    if caption:
        haystacks.append(caption.lower())

    best_scene: str | None = None
    best_score = 0

    for scene, keywords in _SCENE_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            for haystack in haystacks:
                if keyword in haystack:
                    # Labels (index 0) are trusted more than the caption.
                    score += 2 if haystack is not labels and haystack != caption.lower() else 1
                    break
        if score > best_score:
            best_scene, best_score = scene, score

    if best_scene is not None:
        return best_scene

    if labels:
        return _DEFAULT_SCENE
    return None


__all__ = ["infer_scene", "_SCENE_KEYWORDS"]
