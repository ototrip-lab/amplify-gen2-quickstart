"use client";

import { fetchAuthSession } from "@aws-amplify/auth";
import { Button, Flex, Text } from "@aws-amplify/ui-react";
import { StorageManager } from "@aws-amplify/ui-react-storage";
import {
  createAmplifyAuthAdapter,
  createStorageBrowser,
} from "@aws-amplify/ui-react-storage/browser";
import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";

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

const MyStorageBrowser = ({ identityID }: { identityID: string }) => {
  const state = useView("LocationDetail");

  if (!state.location.current) {
    return <CustomLocationsView identityID={identityID} />;
  }
  return <StorageBrowser.LocationDetailView />;
};

const App = () => {
  const [identityID, setIdentityID] = useState<string>("");

  useEffect(() => {
    const fetchIdentityId = async () => {
      const session = await fetchAuthSession();
      setIdentityID(session.identityId || "");
    };
    fetchIdentityId();
  }, []);

  return (
    <Flex direction="column" rowGap="l" margin="large">
      <StorageManager accessLevel="private" maxFileCount={1} />
      <StorageBrowser.Provider
        displayText={{
          LocationsView: {
            title: "Knowledge",
          },
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
