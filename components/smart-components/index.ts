import {
  ServersideSmartComponentMap,
  SmartComponentMap,
} from "@pantheon-systems/pcc-react-sdk/components";
import LeadCapture from "./lead-capture";
import MediaPreview from "./media-preview";

export const serverSmartComponentMap: ServersideSmartComponentMap = {
  LEAD_CAPTURE: {
    title: "Lead Capture Form",
    iconUrl: null,
    fields: {
      title: {
        displayName: "Title",
        required: true,
        type: "string",
      },
      body: {
        displayName: "Body",
        required: false,
        type: "string",
      },
    },
  },
  MEDIA_PREVIEW: {
    title: "Media Preview",
    iconUrl: null,
    fields: {
      url: {
        displayName: "URL",
        required: true,
        type: "string",
      },
    },
  },
};

export const clientSmartComponentMap: SmartComponentMap = {
  LEAD_CAPTURE: {
    ...serverSmartComponentMap.LEAD_CAPTURE,
    reactComponent: LeadCapture,
  },
  MEDIA_PREVIEW: {
    ...serverSmartComponentMap.MEDIA_PREVIEW,
    reactComponent: MediaPreview,
  },
};
