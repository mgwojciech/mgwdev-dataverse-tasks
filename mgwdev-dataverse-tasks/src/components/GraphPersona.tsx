import { IUser } from "mgwdev-m365-helpers";
import * as React from "react";
import { useGraph } from "../context/GraphContext";
import { PersonaService } from "../services/PersonaService";
import { IPersonaProps, Persona, Spinner } from "@fluentui/react";

export interface IGraphPersonaProps extends IPersonaProps {
  id?: string;
  user?: IUser;
  showPresence?: boolean;
  showSecondaryText?: boolean;
}

export function GraphPersona(props: IGraphPersonaProps) {
  const { id } = props;
  const { graphClient } = useGraph();

  const personaService = React.useRef(new PersonaService(graphClient, props.showPresence))
  const [loading, setLoading] = React.useState(!props.user);
  const [user, setUser] = React.useState<IUser>(props.user);
  const getUserInfo = async () => {
    const userResult = await personaService.current.getUser(id!);
    setUser({
      ...props.user,
      ...userResult,
    });
    setLoading(false);
  };
  React.useEffect(() => {
    if(!props.user)
      getUserInfo();
    else{
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  React.useEffect(()=>{
    if(props.user){
      setUser(props.user);
      setLoading(false);
    }
  }, [props.user])

  if (loading) {
    return <Spinner />
  }

  const primaryText = user?.displayName || props.text || props.title || props.id;
  return (
    <Persona
      {...props}
      secondaryText={(props.showSecondaryText || props.secondaryText) ? (props.secondaryText || user?.jobTitle) : undefined}
      imageUrl={user?.photo}
    />
  );
}

