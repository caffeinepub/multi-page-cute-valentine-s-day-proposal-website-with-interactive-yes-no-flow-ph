import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile management
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Persistent type for Valentine content
  public type ValentineContent = {
    section2 : Section2;
    featuredStories : [FeaturedStory];
    featuredGameStory : Story;
    featuredDapps : [FeaturedDapp];
  };

  public type Section2 = {
    title : Text;
    subtitle : [Text];
  };

  public type FeaturedStory = {
    title : Text;
    intro : Text;
    quote : Story;
  };

  public type Story = {
    author : Text;
    image : Text;
    loveNote : Text;
  };

  public type FeaturedDapp = {
    author : Text;
    projectName : Text;
    image : Text;
    dappSummary : Text;
    dappBenefits : [Text];
  };

  var publishedContent : ValentineContent = {
    section2 = {
      title = "Open Love's journey is just getting started";
      subtitle = [
        "Open Love is about more than love stories. It's also a place for us to showcase Internet Computer dapps and the visionary people building our digital future — and to thank those who make the Internet Computer possible.",
        "Love on the blockchain is real. Reality meets cyberspace in the dapps and stories below.",
      ];
    };
    featuredStories = [
      {
        title = "Digital Nomad";
        intro = "Marrying someone from the opposite side of the globe... who could imagine it?";
        quote = {
          author = "Pawel & Vicky";
          image = "https://m4lvn-5aaaa-aaaag-abdfa-cai.raw.icp0.io/open-love/img/dn.avif";
          loveNote = "Because of you, I learned how to become a better human. Thank you for accepting me for who I am and always pushing me to be better. I can't live without you (and cappuccino!)";
        };
      },
      {
        title = "10,000 miles apart";
        intro = "Their story is a remarkable blend of synchronicity and destiny.";
        quote = {
          author = "Chris & Cyber";
          image = "https://m4lvn-5aaaa-aaaag-abdfa-cai.raw.icp0.io/open-love/img/africa.avif";
          loveNote = "I love you in so many ways. You always put a smile on my face and support me in all my decisions. Every day, you show me unconditional love through your words and actions. I want to keep loving you for the rest of my life.";
        };
      },
      {
        title = "After School Sweetheart";
        intro = "We crossed paths over a decade ago. Life's journey led us apart, but here we are, together.";
        quote = {
          author = "Johannes & Judith";
          image = "https://m4lvn-5aaaa-aaaag-abdfa-cai.raw.icp0.io/open-love/img/as.avif";
          loveNote = "Darling, you're the sweetest person I know. I hope we get to build a beautiful life together and start that family you're dreaming of. I love you.";
        };
      },
    ];
    featuredGameStory = {
      author = "Internet Computer Game Developers";
      image = "https://m4lvn-5aaaa-aaaag-abdfa-cai.raw.icp0.io/open-love/img/gaming.avif";
      loveNote = "Gaming brings people together. People fall in love every night while playing online games. Your games are bringing people together and creating real connections inside the digital universe. We love you and the games you create.";
    };
    featuredDapps = [];
  };

  public query ({ caller }) func getPublishedContent() : async ValentineContent {
    publishedContent;
  };

  public shared ({ caller }) func updatePublishedContent(newContent : ValentineContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    publishedContent := newContent;
  };
};
