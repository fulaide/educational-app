// src/components/ImagePicker.svelte
import "svelte/internal/disclose-version";
import * as $3 from "svelte/internal/client";

// src/utils/preset-images.ts
var CLASS_AVATAR_PRESETS = [
  // Animals
  {
    id: "owl-classroom",
    url: "/assets/class-avatars/owl-classroom.svg",
    category: "class-avatars",
    alt: "Wise owl with graduation cap",
    tags: ["animal", "wise", "education", "popular"]
  },
  {
    id: "bear-reading",
    url: "/assets/class-avatars/bear-reading.svg",
    category: "class-avatars",
    alt: "Friendly bear reading a book",
    tags: ["animal", "reading", "friendly", "popular"]
  },
  // School Objects
  {
    id: "colorful-pencils",
    url: "/assets/class-avatars/colorful-pencils.svg",
    category: "class-avatars",
    alt: "Bundle of colorful pencils",
    tags: ["school", "creative", "colorful", "writing", "popular"]
  },
  {
    id: "open-book",
    url: "/assets/class-avatars/open-book.svg",
    category: "class-avatars",
    alt: "Open book with golden pages",
    tags: ["school", "reading", "knowledge", "popular"]
  },
  // Abstract & Geometric
  {
    id: "rainbow-circle",
    url: "/assets/class-avatars/rainbow-circle.svg",
    category: "class-avatars",
    alt: "Colorful rainbow circle",
    tags: ["abstract", "colorful", "rainbow", "positive", "popular"]
  },
  {
    id: "star-burst",
    url: "/assets/class-avatars/star-burst.svg",
    category: "class-avatars",
    alt: "Golden star with burst effect",
    tags: ["abstract", "achievement", "success", "motivational"]
  }
];
var REWARD_IMAGE_PRESETS = [
  // Achievement badges
  {
    id: "gold-star",
    url: "/assets/reward-images/gold-star.webp",
    category: "reward-images",
    alt: "Shiny gold star",
    tags: ["achievement", "star", "gold", "popular"]
  },
  {
    id: "trophy-winner",
    url: "/assets/reward-images/trophy-winner.webp",
    category: "reward-images",
    alt: "Winner trophy cup",
    tags: ["achievement", "trophy", "winner", "success"]
  },
  {
    id: "medal-honor",
    url: "/assets/reward-images/medal-honor.webp",
    category: "reward-images",
    alt: "Honor medal with ribbon",
    tags: ["achievement", "medal", "honor", "recognition"]
  },
  // Fun rewards
  {
    id: "ice-cream-treat",
    url: "/assets/reward-images/ice-cream-treat.webp",
    category: "reward-images",
    alt: "Colorful ice cream cone",
    tags: ["treat", "fun", "sweet", "popular"]
  },
  {
    id: "playground-fun",
    url: "/assets/reward-images/playground-fun.webp",
    category: "reward-images",
    alt: "Fun playground equipment",
    tags: ["fun", "play", "active", "outdoor"]
  }
];
function getPresetImages(category) {
  switch (category) {
    case "class-avatars":
      return CLASS_AVATAR_PRESETS;
    case "reward-images":
      return REWARD_IMAGE_PRESETS;
    case "student-profiles":
    case "achievements":
      return [];
    // To be implemented later
    default:
      return [];
  }
}
function getPresetImagesByTags(category, tags) {
  const presets = getPresetImages(category);
  if (tags.length === 0) return presets;
  return presets.filter(
    (preset) => tags.some((tag) => preset.tags.includes(tag))
  );
}
function getPopularPresetImages(category) {
  return getPresetImagesByTags(category, ["popular"]);
}
function searchPresetImages(category, query) {
  const presets = getPresetImages(category);
  const lowerQuery = query.toLowerCase();
  return presets.filter(
    (preset) => preset.alt.toLowerCase().includes(lowerQuery) || preset.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

// src/utils/vercel-blob.ts
import { put, del, list } from "@vercel/blob";
async function uploadToBlob(file, options) {
  const { folder, filename, maxSize = 5 * 1024 * 1024 } = options;
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`);
  }
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP files are allowed.");
  }
  const timestamp = Date.now();
  const extension = file.name.split(".").pop() || "jpg";
  const finalFilename = filename ? `${filename}.${extension}` : `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const blobPath = `${folder}/${finalFilename}`;
  try {
    const { url } = await put(blobPath, file, {
      access: "public",
      handleUploadUrl: "/api/media/upload"
    });
    return {
      url,
      type: "custom",
      size: file.size,
      filename: finalFilename
    };
  } catch (error) {
    console.error("Failed to upload to Vercel Blob:", error);
    throw new Error("Upload failed. Please try again.");
  }
}
async function deleteFromBlob(url) {
  try {
    await del(url);
  } catch (error) {
    console.error("Failed to delete from Vercel Blob:", error);
    throw new Error("Delete failed. Please try again.");
  }
}
async function listBlobFiles(folder) {
  try {
    const { blobs } = await list({
      prefix: `${folder}/`,
      limit: 100
    });
    return blobs;
  } catch (error) {
    console.error("Failed to list Blob files:", error);
    throw new Error("Failed to list files.");
  }
}
function validateImageFile(file, maxSize = 5 * 1024 * 1024) {
  if (file.size > maxSize) {
    return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
  }
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return "Only JPEG, PNG, and WebP files are allowed";
  }
  return null;
}
function generateThumbnailUrl(url, size = 256) {
  return url;
}

// src/components/PresetGallery.svelte
import "svelte/internal/disclose-version";
import * as $ from "svelte/internal/client";
function clearFilters(_, searchQuery, selectedTags) {
  $.set(searchQuery, "");
  $.set(selectedTags, [], true);
}
var on_click = (__1, toggleTag, tag) => toggleTag($.get(tag));
var root_2 = $.from_html(`<button type="button"> </button>`);
var root_3 = $.from_html(`<button type="button" class="clear-filters svelte-1l4d1g0">Clear</button>`);
var root_1 = $.from_html(`<div class="tag-filters svelte-1l4d1g0"><span class="filter-label svelte-1l4d1g0">Filter by:</span> <!> <!></div>`);
var on_click_1 = (__2, selectPreset, preset) => selectPreset($.get(preset));
var root_5 = $.from_html(`<span class="preset-tag svelte-1l4d1g0"> </span>`);
var root_4 = $.from_html(`<button type="button"><img class="preset-image svelte-1l4d1g0" loading="lazy"/> <div class="preset-overlay svelte-1l4d1g0"><div class="preset-tags svelte-1l4d1g0"></div></div></button>`);
var root_6 = $.from_html(`<div class="no-results svelte-1l4d1g0"><svg class="no-results-icon svelte-1l4d1g0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> <p class="svelte-1l4d1g0">No images found matching your criteria.</p> <button type="button" class="clear-filters-btn svelte-1l4d1g0">Clear Filters</button></div>`);
var root = $.from_html(`<div class="preset-gallery svelte-1l4d1g0"><div class="controls svelte-1l4d1g0"><div class="search-box svelte-1l4d1g0"><input type="text" placeholder="Search images..." class="search-input svelte-1l4d1g0"/></div> <!></div> <div class="image-grid svelte-1l4d1g0"></div></div>`);
function PresetGallery($$anchor, $$props) {
  $.push($$props, true);
  const allPresets = getPresetImages($$props.category);
  let searchQuery = $.state("");
  let selectedTags = $.state($.proxy([]));
  const availableTags = $.derived(() => () => {
    const tagSet = /* @__PURE__ */ new Set();
    allPresets.forEach((preset) => {
      preset.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  });
  const filteredPresets = $.derived(() => () => {
    let filtered = allPresets;
    if ($.get(searchQuery).trim()) {
      const query = $.get(searchQuery).toLowerCase();
      filtered = filtered.filter((preset) => preset.alt.toLowerCase().includes(query) || preset.tags.some((tag) => tag.toLowerCase().includes(query)));
    }
    if ($.get(selectedTags).length > 0) {
      filtered = filtered.filter((preset) => $.get(selectedTags).every((tag) => preset.tags.includes(tag)));
    }
    return filtered;
  });
  function selectPreset(preset) {
    $$props.onSelect?.(preset);
  }
  function toggleTag(tag) {
    if ($.get(selectedTags).includes(tag)) {
      $.set(selectedTags, $.get(selectedTags).filter((t) => t !== tag), true);
    } else {
      $.set(selectedTags, [...$.get(selectedTags), tag], true);
    }
  }
  var div = root();
  var div_1 = $.child(div);
  var div_2 = $.child(div_1);
  var input = $.child(div_2);
  $.remove_input_defaults(input);
  $.reset(div_2);
  var node = $.sibling(div_2, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_3 = root_1();
      var node_1 = $.sibling($.child(div_3), 2);
      $.each(node_1, 17, () => $.get(availableTags), $.index, ($$anchor3, tag) => {
        var button = root_2();
        button.__click = [on_click, toggleTag, tag];
        var text = $.child(button, true);
        $.reset(button);
        $.template_effect(
          ($0) => {
            $.set_class(button, 1, `tag-filter ${$0 ?? ""}`, "svelte-1l4d1g0");
            $.set_text(text, $.get(tag));
          },
          [
            () => $.get(selectedTags).includes($.get(tag)) ? "active" : ""
          ]
        );
        $.append($$anchor3, button);
      });
      var node_2 = $.sibling(node_1, 2);
      {
        var consequent = ($$anchor3) => {
          var button_1 = root_3();
          button_1.__click = [clearFilters, searchQuery, selectedTags];
          $.append($$anchor3, button_1);
        };
        $.if(node_2, ($$render) => {
          if ($.get(selectedTags).length > 0 || $.get(searchQuery).trim()) $$render(consequent);
        });
      }
      $.reset(div_3);
      $.append($$anchor2, div_3);
    };
    $.if(node, ($$render) => {
      if ($.get(availableTags).length > 0) $$render(consequent_1);
    });
  }
  $.reset(div_1);
  var div_4 = $.sibling(div_1, 2);
  $.each(
    div_4,
    21,
    () => $.get(filteredPresets),
    (preset) => preset.id,
    ($$anchor2, preset) => {
      var button_2 = root_4();
      button_2.__click = [on_click_1, selectPreset, preset];
      var img = $.child(button_2);
      var div_5 = $.sibling(img, 2);
      var div_6 = $.child(div_5);
      $.each(div_6, 21, () => $.get(preset).tags.slice(0, 3), $.index, ($$anchor3, tag) => {
        var span = root_5();
        var text_1 = $.child(span, true);
        $.reset(span);
        $.template_effect(() => $.set_text(text_1, $.get(tag)));
        $.append($$anchor3, span);
      });
      $.reset(div_6);
      $.reset(div_5);
      $.reset(button_2);
      $.template_effect(() => {
        $.set_class(button_2, 1, `preset-item ${$$props.currentImage === $.get(preset).url ? "selected" : ""}`, "svelte-1l4d1g0");
        $.set_attribute(button_2, "title", $.get(preset).alt);
        $.set_attribute(img, "src", $.get(preset).url);
        $.set_attribute(img, "alt", $.get(preset).alt);
      });
      $.append($$anchor2, button_2);
    },
    ($$anchor2) => {
      var div_7 = root_6();
      var button_3 = $.sibling($.child(div_7), 4);
      button_3.__click = [clearFilters, searchQuery, selectedTags];
      $.reset(div_7);
      $.append($$anchor2, div_7);
    }
  );
  $.reset(div_4);
  $.reset(div);
  $.bind_value(input, () => $.get(searchQuery), ($$value) => $.set(searchQuery, $$value));
  $.append($$anchor, div);
  $.pop();
}
$.delegate(["click"]);

// src/components/CustomUpload.svelte
import "svelte/internal/disclose-version";
import * as $2 from "svelte/internal/client";
var on_keydown = (e, triggerFileSelect) => e.key === "Enter" || e.key === " " ? triggerFileSelect() : null;
var root_12 = $2.from_html(`<div class="upload-status svelte-2amyv7"><div class="upload-spinner svelte-2amyv7"><svg class="animate-spin svelte-2amyv7" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div> <div class="upload-text svelte-2amyv7"><p class="upload-title svelte-2amyv7">Uploading...</p> <div class="progress-bar svelte-2amyv7"><div class="progress-fill svelte-2amyv7"></div></div> <p class="upload-percentage svelte-2amyv7"> </p></div></div>`);
var root_22 = $2.from_html(`<div class="upload-prompt svelte-2amyv7"><div class="upload-icon svelte-2amyv7"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg></div> <div class="upload-text svelte-2amyv7"><p class="upload-title svelte-2amyv7">Drop your image here</p> <p class="upload-subtitle svelte-2amyv7">or <span class="upload-link svelte-2amyv7">click to browse</span></p></div></div>`);
var root_32 = $2.from_html(`<div class="error-message svelte-2amyv7"><svg class="error-icon svelte-2amyv7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span> </span></div>`);
var root2 = $2.from_html(`<div class="custom-upload svelte-2amyv7"><input type="file" style="display: none;"/> <div role="button" tabindex="0"><!></div> <div class="file-requirements svelte-2amyv7"><h4 class="svelte-2amyv7">File Requirements:</h4> <ul class="svelte-2amyv7"><li class="svelte-2amyv7"> </li> <li class="svelte-2amyv7"> </li> <li class="svelte-2amyv7">Recommended dimensions: 512\xD7512px or larger</li></ul></div> <!></div>`);
function CustomUpload($$anchor, $$props) {
  $2.push($$props, true);
  let fileInputRef;
  let dragOver = $2.state(false);
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }
  function handleDragOver(e) {
    e.preventDefault();
    $2.set(dragOver, true);
  }
  function handleDragLeave(e) {
    e.preventDefault();
    $2.set(dragOver, false);
  }
  function handleDrop(e) {
    e.preventDefault();
    $2.set(dragOver, false);
    if ($$props.isUploading) return;
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      $$props.onFileSelect(files);
    }
  }
  function handleFileChange(e) {
    const target = e.target;
    if (target.files && target.files.length > 0) {
      $$props.onFileSelect(target.files);
    }
    target.value = "";
  }
  function triggerFileSelect() {
    if (!$$props.isUploading) {
      fileInputRef?.click();
    }
  }
  var div = root2();
  var input = $2.child(div);
  input.__change = handleFileChange;
  $2.bind_this(input, ($$value) => fileInputRef = $$value, () => fileInputRef);
  var div_1 = $2.sibling(input, 2);
  div_1.__click = triggerFileSelect;
  div_1.__keydown = [on_keydown, triggerFileSelect];
  var node = $2.child(div_1);
  {
    var consequent = ($$anchor2) => {
      var div_2 = root_12();
      var div_3 = $2.sibling($2.child(div_2), 2);
      var div_4 = $2.sibling($2.child(div_3), 2);
      var div_5 = $2.child(div_4);
      $2.reset(div_4);
      var p = $2.sibling(div_4, 2);
      var text = $2.child(p);
      $2.reset(p);
      $2.reset(div_3);
      $2.reset(div_2);
      $2.template_effect(() => {
        $2.set_style(div_5, `width: ${$$props.uploadProgress ?? ""}%`);
        $2.set_text(text, `${$$props.uploadProgress ?? ""}%`);
      });
      $2.append($$anchor2, div_2);
    };
    var alternate = ($$anchor2) => {
      var div_6 = root_22();
      $2.append($$anchor2, div_6);
    };
    $2.if(node, ($$render) => {
      if ($$props.isUploading) $$render(consequent);
      else $$render(alternate, false);
    });
  }
  $2.reset(div_1);
  var div_7 = $2.sibling(div_1, 2);
  var ul = $2.sibling($2.child(div_7), 2);
  var li = $2.child(ul);
  var text_1 = $2.child(li);
  $2.reset(li);
  var li_1 = $2.sibling(li, 2);
  var text_2 = $2.child(li_1);
  $2.reset(li_1);
  $2.next(2);
  $2.reset(ul);
  $2.reset(div_7);
  var node_1 = $2.sibling(div_7, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_8 = root_32();
      var span = $2.sibling($2.child(div_8), 2);
      var text_3 = $2.child(span, true);
      $2.reset(span);
      $2.reset(div_8);
      $2.template_effect(() => $2.set_text(text_3, $$props.uploadError));
      $2.append($$anchor2, div_8);
    };
    $2.if(node_1, ($$render) => {
      if ($$props.uploadError) $$render(consequent_1);
    });
  }
  $2.reset(div);
  $2.template_effect(
    ($0, $1, $22) => {
      $2.set_attribute(input, "accept", $0);
      input.disabled = $$props.isUploading;
      $2.set_class(div_1, 1, `upload-area ${$2.get(dragOver) ? "drag-over" : ""} ${$$props.isUploading ? "uploading" : ""}`, "svelte-2amyv7");
      $2.set_text(text_1, `Maximum size: ${$1 ?? ""}`);
      $2.set_text(text_2, `Supported formats: ${$22 ?? ""}`);
    },
    [
      () => $$props.acceptedFormats.join(","),
      () => formatFileSize($$props.maxFileSize),
      () => $$props.acceptedFormats.map((f) => f.split("/")[1].toUpperCase()).join(", ")
    ]
  );
  $2.event("dragover", div_1, handleDragOver);
  $2.event("dragleave", div_1, handleDragLeave);
  $2.event("drop", div_1, handleDrop);
  $2.append($$anchor, div);
  $2.pop();
}
$2.delegate(["change", "click", "keydown"]);

// src/components/ImagePicker.svelte
var on_click2 = (_, switchTab) => switchTab("presets");
var on_click_12 = (__1, switchTab) => switchTab("upload");
var root_13 = $3.from_html(`<button type="button">Upload Custom</button>`);
var root_52 = $3.from_html(`<div class="selected-preview svelte-ikvep"><h4 class="svelte-ikvep">Selected Image:</h4> <div class="preview-image svelte-ikvep"><img class="preview-img svelte-ikvep"/></div></div>`);
var root3 = $3.from_html(`<div class="image-picker svelte-ikvep"><div class="tab-navigation svelte-ikvep"><button type="button">Choose from Gallery</button> <!></div> <div class="tab-content svelte-ikvep"><!></div> <!></div>`);
function ImagePicker($$anchor, $$props) {
  $3.push($$props, true);
  let allowUpload = $3.prop($$props, "allowUpload", 3, true), maxFileSize = $3.prop($$props, "maxFileSize", 3, 5 * 1024 * 1024), acceptedFormats = $3.prop($$props, "acceptedFormats", 19, () => ["image/jpeg", "image/png", "image/webp"]), multiple = $3.prop($$props, "multiple", 3, false);
  let selectedImages = $3.state($3.proxy([]));
  let isUploading = $3.state(false);
  let uploadProgress = $3.state(0);
  let uploadError = $3.state(null);
  let activeTab = $3.state("presets");
  const presetImages = getPresetImages($$props.category);
  function presetToImageAsset2(preset) {
    return {
      id: preset.id,
      url: preset.url,
      type: "preset",
      category: preset.category,
      alt: preset.alt,
      metadata: { tags: preset.tags, thumbnail: preset.thumbnail },
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
  }
  function handlePresetSelect(preset) {
    const imageAsset = presetToImageAsset2(preset);
    $3.set(selectedImages, [imageAsset], true);
    $$props.onSelect?.([imageAsset]);
  }
  async function handleCustomUpload(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const validationError = validateImageFile(file, maxFileSize());
    if (validationError) {
      $3.set(isUploading, false);
      $3.set(uploadProgress, 0);
      $3.set(uploadError, validationError, true);
      $$props.onError?.(validationError);
      return;
    }
    $3.set(isUploading, true);
    $3.set(uploadProgress, 0);
    $3.set(uploadError, null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", $$props.category);
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
        credentials: "include"
        // Include session cookies for authentication
      });
      if (!response.ok) {
        if (response.status === 303 || response.status === 302) {
          throw new Error("Authentication required. Please sign in to upload images.");
        }
        const errorData = await response.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }
      const result = await response.json();
      const imageAsset = {
        id: crypto.randomUUID(),
        url: result.url,
        type: "custom",
        category: $$props.category,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      $3.set(selectedImages, [imageAsset], true);
      $3.set(isUploading, false);
      $3.set(uploadProgress, 100);
      $3.set(uploadError, null);
      $$props.onSelect?.($3.get(selectedImages));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      $3.set(isUploading, false);
      $3.set(uploadProgress, 0);
      $3.set(uploadError, errorMessage, true);
      $$props.onError?.(errorMessage);
    }
  }
  function switchTab(tab) {
    $3.set(activeTab, tab, true);
    $3.set(uploadError, null);
  }
  var div = root3();
  var div_1 = $3.child(div);
  var button = $3.child(div_1);
  button.__click = [on_click2, switchTab];
  var node = $3.sibling(button, 2);
  {
    var consequent = ($$anchor2) => {
      var button_1 = root_13();
      button_1.__click = [on_click_12, switchTab];
      $3.template_effect(() => $3.set_class(button_1, 1, `tab-button ${$3.get(activeTab) === "upload" ? "active" : ""}`, "svelte-ikvep"));
      $3.append($$anchor2, button_1);
    };
    $3.if(node, ($$render) => {
      if (allowUpload()) $$render(consequent);
    });
  }
  $3.reset(div_1);
  var div_2 = $3.sibling(div_1, 2);
  var node_1 = $3.child(div_2);
  {
    var consequent_1 = ($$anchor2) => {
      PresetGallery($$anchor2, {
        get category() {
          return $$props.category;
        },
        get currentImage() {
          return $$props.currentImage;
        },
        onSelect: handlePresetSelect
      });
    };
    var alternate = ($$anchor2) => {
      var fragment_1 = $3.comment();
      var node_2 = $3.first_child(fragment_1);
      {
        var consequent_2 = ($$anchor3) => {
          CustomUpload($$anchor3, {
            get maxFileSize() {
              return maxFileSize();
            },
            get acceptedFormats() {
              return acceptedFormats();
            },
            get isUploading() {
              return $3.get(isUploading);
            },
            get uploadProgress() {
              return $3.get(uploadProgress);
            },
            get uploadError() {
              return $3.get(uploadError);
            },
            onFileSelect: handleCustomUpload
          });
        };
        $3.if(
          node_2,
          ($$render) => {
            if ($3.get(activeTab) === "upload" && allowUpload()) $$render(consequent_2);
          },
          true
        );
      }
      $3.append($$anchor2, fragment_1);
    };
    $3.if(node_1, ($$render) => {
      if ($3.get(activeTab) === "presets") $$render(consequent_1);
      else $$render(alternate, false);
    });
  }
  $3.reset(div_2);
  var node_3 = $3.sibling(div_2, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var div_3 = root_52();
      var div_4 = $3.sibling($3.child(div_3), 2);
      var img = $3.child(div_4);
      $3.reset(div_4);
      $3.reset(div_3);
      $3.template_effect(() => {
        $3.set_attribute(img, "src", $3.get(selectedImages)[0].url);
        $3.set_attribute(img, "alt", $3.get(selectedImages)[0].alt || "Selected image");
      });
      $3.append($$anchor2, div_3);
    };
    $3.if(node_3, ($$render) => {
      if ($3.get(selectedImages).length > 0) $$render(consequent_3);
    });
  }
  $3.reset(div);
  $3.template_effect(() => $3.set_class(button, 1, `tab-button ${$3.get(activeTab) === "presets" ? "active" : ""}`, "svelte-ikvep"));
  $3.append($$anchor, div);
  $3.pop();
}
$3.delegate(["click"]);

// src/stores/media.svelte.js
var MediaManager = class {
  constructor() {
    this.selectedImages = $state([]);
    this.isUploading = $state(false);
    this.uploadProgress = $state(0);
    this.uploadError = $state(null);
    this.presetImages = $state(/* @__PURE__ */ new Map());
    this.activeTab = $state("presets");
    this.showCropper = $state(false);
  }
  /**
   * Select an image (preset or uploaded)
   * @param {ImageAsset} image
   */
  selectImage(image) {
    this.selectedImages = [image];
  }
  /**
   * Select multiple images
   * @param {ImageAsset[]} images
   */
  selectImages(images) {
    this.selectedImages = [...images];
  }
  /**
   * Clear selected images
   */
  clearSelection() {
    this.selectedImages = [];
  }
  /**
   * Add uploaded image to selection
   * @param {UploadResult} result
   * @param {ImageCategory} category
   */
  addUploadedImage(result, category) {
    const imageAsset = {
      id: crypto.randomUUID(),
      url: result.url,
      type: result.type,
      category,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.selectedImages = [imageAsset];
  }
  /**
   * Set upload state
   * @param {boolean} uploading
   * @param {number} progress
   * @param {string|null} error
   */
  setUploadState(uploading, progress = 0, error = null) {
    this.isUploading = uploading;
    this.uploadProgress = progress;
    this.uploadError = error;
  }
  /**
   * Cache preset images for a category
   * @param {ImageCategory} category
   * @param {PresetImage[]} images
   */
  cachePresetImages(category, images) {
    this.presetImages.set(category, images);
  }
  /**
   * Get cached preset images
   * @param {ImageCategory} category
   * @returns {PresetImage[]}
   */
  getCachedPresetImages(category) {
    return this.presetImages.get(category) || [];
  }
  /**
   * Switch active tab
   * @param {'presets' | 'upload'} tab
   */
  setActiveTab(tab) {
    this.activeTab = tab;
  }
  /**
   * Show/hide image cropper
   * @param {boolean} show
   */
  toggleCropper(show) {
    this.showCropper = show;
  }
  /**
   * Reset all state
   */
  reset() {
    this.selectedImages = [];
    this.isUploading = false;
    this.uploadProgress = 0;
    this.uploadError = null;
    this.activeTab = "presets";
    this.showCropper = false;
  }
};
function createMediaManager() {
  return new MediaManager();
}
function presetToImageAsset(preset) {
  return {
    id: preset.id,
    url: preset.url,
    type: "preset",
    category: preset.category,
    alt: preset.alt,
    metadata: {
      tags: preset.tags,
      thumbnail: preset.thumbnail
    },
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  };
}

// src/types.ts
import { z } from "zod";
var uploadFileSchema = z.object({
  file: z.instanceof(File),
  category: z.enum(["class-avatars", "reward-images", "student-profiles", "achievements"]),
  alt: z.string().optional()
});
var imageAssetSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  type: z.enum(["preset", "custom"]),
  category: z.enum(["class-avatars", "reward-images", "student-profiles", "achievements"]),
  alt: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export {
  CLASS_AVATAR_PRESETS,
  CustomUpload,
  ImagePicker,
  MediaManager,
  PresetGallery,
  REWARD_IMAGE_PRESETS,
  createMediaManager,
  deleteFromBlob,
  generateThumbnailUrl,
  getPopularPresetImages,
  getPresetImages,
  getPresetImagesByTags,
  imageAssetSchema,
  listBlobFiles,
  presetToImageAsset,
  searchPresetImages,
  uploadFileSchema,
  uploadToBlob,
  validateImageFile
};
//# sourceMappingURL=index.js.map