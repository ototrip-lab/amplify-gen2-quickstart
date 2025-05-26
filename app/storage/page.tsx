"use client";

import { fetchAuthSession } from "@aws-amplify/auth";
import {
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  useTheme,
} from "@aws-amplify/ui-react";
import {
  createAmplifyAuthAdapter,
  createStorageBrowser,
} from "@aws-amplify/ui-react-storage/browser";
import "@aws-amplify/ui-react/styles.css";
import { useEffect, useRef, useState } from "react";

import "@/app/_components/ConfigureAmplify";

const { StorageBrowser, useView } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
});

const CustomLocationsView = ({ identityID }: { identityID: string }) => {
  const state = useView("Locations");

  return (
    <Flex direction="column" padding="medium">
      <Text fontWeight="bold">Locations</Text>
      {state.pageItems.map((location) => {
        if (!location.prefix.includes(identityID)) return null;

        return (
          <Button
            key={location.id}
            justifyContent="flex-start"
            onClick={() => {
              state.onNavigate(location);
            }}
          >
            <Text flex="1">
              {location.prefix.replace(`${identityID}/`, "")}
            </Text>
            <Text as="span" color="font.tertiary" fontWeight="normal">
              {location.permissions.includes("list") ? "Read" : null}
              {" / "}
              {location.permissions.includes("write") ? "Write" : null}
            </Text>
          </Button>
        );
      })}
    </Flex>
  );
};

const MyLocationActionView = () => {
  const state = useView("LocationDetail");
  switch (state.actionType) {
    case "copy":
      return <StorageBrowser.CopyView />;
    case "createFolder":
      return <StorageBrowser.CreateFolderView />;
    case "delete":
      return <StorageBrowser.DeleteView />;
    case "upload":
    default:
      return <StorageBrowser.UploadView />;
  }
};

const MyStorageBrowser = ({ identityID }: { identityID: string }) => {
  const state = useView("LocationDetail");
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (state.actionType) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [state.actionType]);

  if (!state.location.current) {
    return <CustomLocationsView identityID={identityID} />;
  }
  return (
    <>
      <StorageBrowser.LocationDetailView />
      <dialog ref={ref}>
        <MyLocationActionView />
      </dialog>
    </>
  );
};

const App = () => {
  const { tokens } = useTheme();
  const [identityID, setIdentityID] = useState<string>("");

  useEffect(() => {
    const fetchIdentityId = async () => {
      const session = await fetchAuthSession();
      setIdentityID(session.identityId || "");
    };
    fetchIdentityId();
  }, []);

  return (
    <Flex
      direction="column"
      gap={tokens.space.medium}
      padding={tokens.space.large}
    >
      <Flex justifyContent="space-between" alignItems="end">
        <Heading level={2}>Storage</Heading>
      </Flex>

      <Divider />
      <StorageBrowser.Provider
        displayText={{
          LocationDetailView: {
            getTitle: (location) => location.key.replace(`${identityID}/`, ""),
          },
        }}
      >
        <MyStorageBrowser identityID={identityID} />
      </StorageBrowser.Provider>
    </Flex>
  );
};

export default App;
