import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";
import { authApi, extractApiError, listingApi } from "../lib/api";
import "./Profile.css";

function Profile() {
  const [me, setMe] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState("");
  const [listingBusyId, setListingBusyId] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const [meData, profileData] = await Promise.all([authApi.me(), authApi.getProfile()]);

      setMe(meData || null);
      setProfile(profileData || null);
    } catch (apiError) {
      setError(extractApiError(apiError, "Unable to load your profile."));
      setMe(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const loadListings = async () => {
    try {
      setListingsLoading(true);
      setListingsError("");
      const response = await listingApi.getMine();
      setListings(Array.isArray(response?.data) ? response.data : []);
    } catch (apiError) {
      setListingsError(extractApiError(apiError, "Unable to load your listings."));
      setListings([]);
    } finally {
      setListingsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadListings();
  }, []);

  const joinedDate = useMemo(() => {
    if (!me?.created_at) {
      return "Not available";
    }

    const date = new Date(me.created_at);
    return Number.isNaN(date.getTime())
      ? "Not available"
      : date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  }, [me]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Account"
        title="User profile"
        description="Review your account details and community profile settings."
        actions={
          <Link className="btn btn-primary" to="/profile/edit">
            Edit profile
          </Link>
        }
      />

      {loading ? (
        <StatusState
          tone="info"
          title="Loading profile"
          message="Fetching your latest account and profile details..."
        />
      ) : null}

      {!loading && error ? (
        <StatusState
          tone="error"
          title="Could not load profile"
          message={error}
        />
      ) : null}

      {!loading && !error && profile ? (
        <div className="profile-grid">
          <SectionCard
            id="profile-account"
            title="Account"
            description="Authentication identity details"
          >
            <dl className="profile-list">
              <div className="profile-row">
                <dt>Email</dt>
                <dd>{me?.email || "Not available"}</dd>
              </div>
              <div className="profile-row">
                <dt>Joined</dt>
                <dd>{joinedDate}</dd>
              </div>
              <div className="profile-row">
                <dt>User ID</dt>
                <dd>{me?.id || "Not available"}</dd>
              </div>
            </dl>
          </SectionCard>

          <SectionCard
            id="profile-public"
            title="Public profile"
            description="This information is stored in your profile table"
          >
            <dl className="profile-list">
              <div className="profile-row">
                <dt>Username</dt>
                <dd>{profile.username || "Not set"}</dd>
              </div>
              <div className="profile-row">
                <dt>Bio</dt>
                <dd>{profile.bio || "Not set"}</dd>
              </div>
              <div className="profile-row">
                <dt>City</dt>
                <dd>{profile.city || "Not set"}</dd>
              </div>
              <div className="profile-row">
                <dt>Location</dt>
                <dd>{profile.location || "Not set"}</dd>
              </div>
              <div className="profile-row">
                <dt>Reputation score</dt>
                <dd>
                  {profile.reputation_score != null ? String(profile.reputation_score) : "0"}
                </dd>
              </div>
            </dl>
          </SectionCard>

          <SectionCard
            id="profile-listings"
            title="Your listings"
            description="Listings you have created."
            action={
              <button
                className="btn btn-ghost"
                type="button"
                onClick={loadListings}
                disabled={listingsLoading}
              >
                {listingsLoading ? "Refreshing..." : "Refresh"}
              </button>
            }
          >
            {listingsLoading ? (
              <StatusState
                tone="info"
                title="Loading listings"
                message="Fetching your latest listings..."
              />
            ) : null}

            {!listingsLoading && listingsError ? (
              <StatusState tone="error" title="Could not load listings" message={listingsError} />
            ) : null}

            {!listingsLoading && !listingsError && listings.length === 0 ? (
              <StatusState
                tone="neutral"
                title="No listings yet"
                message="Create a listing to see it here."
              />
            ) : null}

            {!listingsLoading && !listingsError && listings.length > 0 ? (
              <div className="profile-listings" role="list">
                {listings.map((listing) => (
                  <article className="profile-listing-card" role="listitem" key={listing.id}>
                    <p className="profile-listing-eyebrow">{listing.books?.genre || "General"}</p>
                    <h3>{listing.books?.title || "Untitled Book"}</h3>
                    <p className="profile-listing-subtitle">
                      by {listing.books?.author || "Unknown author"}
                    </p>
                    <p className="profile-listing-meta">
                      Condition: {listing.condition || "Not set"}
                    </p>
                    <p className="profile-listing-meta">
                      Price: {listing.price ? `$${listing.price}` : "N/A"}
                    </p>
                    <div className="profile-listing-actions">
                      <Link className="btn btn-ghost" to={`/books/${listing.id}`}>
                        View
                      </Link>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={async () => {
                          try {
                            setListingBusyId(listing.id);
                            await listingApi.remove(listing.id);
                            setListings((prev) => prev.filter((item) => item.id !== listing.id));
                          } catch (apiError) {
                            setListingsError(
                              extractApiError(apiError, "Unable to delete listing."),
                            );
                          } finally {
                            setListingBusyId("");
                          }
                        }}
                        disabled={listingBusyId === listing.id}
                      >
                        {listingBusyId === listing.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </SectionCard>
        </div>
      ) : null}
    </PageShell>
  );
}

export default Profile;
